var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AiOrchestratorService_1;
import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/database.module.js';
import { CaseModelRouterService } from '../case-model-router/case-model-router.service.js';
import { AiGatewayService } from '../ai-gateway/ai-gateway.service.js';
import { PromptRegistryService } from '../prompt-registry/prompt-registry.service.js';
import { SchemaRegistryService } from '../schema-registry/schema-registry.service.js';
import { AiReviewService } from '../review/ai-review.service.js';
import crypto from 'crypto';
let AiOrchestratorService = AiOrchestratorService_1 = class AiOrchestratorService {
    prisma;
    caseModelRouter;
    aiGateway;
    promptRegistry;
    schemaRegistry;
    reviewService;
    logger = new Logger(AiOrchestratorService_1.name);
    constructor(prisma, caseModelRouter, aiGateway, promptRegistry, schemaRegistry, reviewService) {
        this.prisma = prisma;
        this.caseModelRouter = caseModelRouter;
        this.aiGateway = aiGateway;
        this.promptRegistry = promptRegistry;
        this.schemaRegistry = schemaRegistry;
        this.reviewService = reviewService;
    }
    async processJob(useCase, organizationId, requestedBy, context) {
        this.logger.log(`Starting AI job for use case: ${useCase}, Org: ${organizationId}`);
        const route = await this.caseModelRouter.getRouteForUseCase(useCase);
        if (!route) {
            throw new Error(`No routing policy found for use case ${useCase}`);
        }
        const promptDef = await this.promptRegistry.getPrompt(useCase);
        const schemaDef = await this.schemaRegistry.getSchema(useCase);
        if (!promptDef || !schemaDef) {
            throw new Error(`Missing prompt or schema definition for ${useCase}`);
        }
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
            const systemPrompt = `${promptDef.systemPrompt}\nConstraints: ${promptDef.safetyConstraints.join(', ')}\nContext: ${JSON.stringify(context)}`;
            const requestChecksum = crypto.createHash('sha256').update(systemPrompt).digest('hex');
            const startTime = Date.now();
            const gatewayResponse = await this.aiGateway.generateStructured({
                model: route.primaryModelAlias,
                systemPrompt: systemPrompt,
                userPrompt: JSON.stringify(context.extractedText || "Process this document according to the schema."),
            }, schemaDef.jsonSchema);
            const latencyMs = Date.now() - startTime;
            const responseChecksum = crypto.createHash('sha256').update(JSON.stringify(gatewayResponse.data)).digest('hex');
            const run = await this.prisma.aIModelRun.create({
                data: {
                    jobId: job.id,
                    modelAlias: route.primaryModelAlias,
                    providerModelId: route.primaryModelAlias,
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
            let validationWarnings = null;
            try {
                this.schemaRegistry.validateData(useCase, gatewayResponse.data);
            }
            catch (err) {
                validationWarnings = JSON.stringify({ error: err.message });
                this.logger.warn(`Schema validation failed for job ${job.id}`);
            }
            await this.prisma.aIExtractionResult.create({
                data: {
                    jobId: job.id,
                    modelRunId: run.id,
                    encryptedStructuredResult: JSON.stringify(gatewayResponse.data),
                    validationWarnings,
                }
            });
            let finalStatus = 'COMPLETED';
            if (route.humanReviewPolicy === 'REQUIRED') {
                finalStatus = 'NEEDS_REVIEW';
                await this.reviewService.createReviewTask(job.id, useCase, 'DOCTOR');
            }
            return this.prisma.aIProcessingJob.update({
                where: { id: job.id },
                data: {
                    status: finalStatus,
                    completedAt: finalStatus === 'COMPLETED' ? new Date() : null,
                }
            });
        }
        catch (error) {
            this.logger.error(`AI Job ${job.id} failed:`, error);
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
};
AiOrchestratorService = AiOrchestratorService_1 = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService,
        CaseModelRouterService,
        AiGatewayService,
        PromptRegistryService,
        SchemaRegistryService,
        AiReviewService])
], AiOrchestratorService);
export { AiOrchestratorService };
//# sourceMappingURL=ai-orchestrator.service.js.map