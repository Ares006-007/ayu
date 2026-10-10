import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/database.module.js';
import { CaseModelRouterService } from '../case-model-router/case-model-router.service.js';
import { AiGatewayService } from '../ai-gateway/ai-gateway.service.js';
import { PromptRegistryService } from '../prompt-registry/prompt-registry.service.js';
import { SchemaRegistryService } from '../schema-registry/schema-registry.service.js';
import { AiReviewService } from '../review/ai-review.service.js';
import { UseCaseContext, AIUseCase } from '../types.js';
import crypto from 'crypto';

@Injectable()
export class AiOrchestratorService {
  private readonly logger = new Logger(AiOrchestratorService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly caseModelRouter: CaseModelRouterService,
    private readonly aiGateway: AiGatewayService,
    private readonly promptRegistry: PromptRegistryService,
    private readonly schemaRegistry: SchemaRegistryService,
    private readonly reviewService: AiReviewService,
  ) {}

  async processJob(
    useCase: AIUseCase,
    organizationId: string,
    requestedBy: string,
    context: UseCaseContext
  ) {
    this.logger.log(`Starting AI job for use case: ${useCase}, Org: ${organizationId}`);

    // 1. Resolve Routing Policy
    const route = await this.caseModelRouter.getRouteForUseCase(useCase);
    if (!route) {
      throw new Error(`No routing policy found for use case ${useCase}`);
    }

    // 2. Fetch Prompt & Schema
    const promptDef = await this.promptRegistry.getPrompt(useCase);
    const schemaDef = await this.schemaRegistry.getSchema(useCase);

    if (!promptDef || !schemaDef) {
      throw new Error(`Missing prompt or schema definition for ${useCase}`);
    }

    // 3. Create Job Record
    const job = await this.prisma.aIProcessingJob.create({
      data: {
        useCase,
        organizationId,
        requestedBy,
        patientId: context.patientId,
        documentId: context.documentId,
        primaryModelAlias: route.primaryModelAlias,
        promptVersion: '1.0',
        schemaVersion: '1.0',
        status: 'PROCESSING',
        startedAt: new Date(),
        requiresHumanReview: route.humanReviewPolicy === 'REQUIRED',
      }
    });

    try {
      // 4. Format Prompt with Context
      const systemPrompt = `${promptDef.systemPrompt}\nConstraints: ${promptDef.safetyConstraints.join(', ')}\nContext: ${JSON.stringify(context)}`;
      
      // Calculate Checksum for audit
      const requestChecksum = crypto.createHash('sha256').update(systemPrompt).digest('hex');

      // 5. Call Gateway
      const startTime = Date.now();
      const gatewayResponse = await this.aiGateway.generateStructured(
        {
          model: route.primaryModelAlias,
          systemPrompt: systemPrompt,
          userPrompt: JSON.stringify(context.extractedText || "Process this document according to the schema."),
        },
        schemaDef.jsonSchema
      );
      const latencyMs = Date.now() - startTime;

      const responseChecksum = crypto.createHash('sha256').update(JSON.stringify(gatewayResponse.data)).digest('hex');

      // 6. Write Model Run
      const run = await this.prisma.aIModelRun.create({
        data: {
          jobId: job.id,
          modelAlias: route.primaryModelAlias,
          providerModelId: route.primaryModelAlias, // Should ideally resolve providerModelId from ModelRegistry
          provider: 'openai-compatible',
          requestChecksum,
          responseChecksum,
          promptVersion: '1.0',
          schemaVersion: '1.0',
          status: 'SUCCESS',
          latencyMs,
          tokenUsage: gatewayResponse.totalTokens || 0,
        }
      });

      // 7. Validate Response Schema
      let validationWarnings = null;
      try {
        this.schemaRegistry.validateData(useCase, gatewayResponse.data);
      } catch (err) {
        validationWarnings = JSON.stringify({ error: (err as Error).message });
        this.logger.warn(`Schema validation failed for job ${job.id}`);
      }

      // 8. Write Extraction Result
      await this.prisma.aIExtractionResult.create({
        data: {
          jobId: job.id,
          modelRunId: run.id,
          encryptedStructuredResult: JSON.stringify(gatewayResponse.data), // In prod, encrypt this if PHI
          validationWarnings,
        }
      });

      // 9. Handle Human Review
      let finalStatus = 'COMPLETED';
      if (route.humanReviewPolicy === 'REQUIRED') {
        finalStatus = 'NEEDS_REVIEW';
        await this.reviewService.createReviewTask(job.id, useCase, 'DOCTOR');
      }

      // 10. Finalize Job
      return this.prisma.aIProcessingJob.update({
        where: { id: job.id },
        data: {
          status: finalStatus,
          completedAt: finalStatus === 'COMPLETED' ? new Date() : null,
        }
      });

    } catch (error) {
      this.logger.error(`AI Job ${job.id} failed:`, error);
      
      // 11. Handle Failure
      await this.prisma.aIProcessingJob.update({
        where: { id: job.id },
        data: {
          status: 'FAILED',
          failureCategory: 'EXECUTION_ERROR',
          completedAt: new Date(),
        }
      });

      throw error;
    }
  }
}
