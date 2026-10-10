import { Injectable, Logger } from '@nestjs/common';
import { AiOrchestratorService } from '../../orchestrator/ai-orchestrator.service.js';
import { AIUseCase } from '../../types.js';

@Injectable()
export class LabReportPipelineService {
  private readonly logger = new Logger(LabReportPipelineService.name);

  constructor(private readonly orchestrator: AiOrchestratorService) {}

  /**
   * Main entry point for the Lab Report parsing pipeline.
   * Runs local deterministic parsing first, then falls back to AI for ambiguous rows.
   */
  async processLabReport(
    documentId: string,
    extractedText: string,
    organizationId: string,
    requestedBy: string,
    patientId?: string
  ) {
    this.logger.log(`Starting lab report pipeline for document ${documentId}`);

    // 1. Table Extraction (Mocked)
    this.logger.log('Running deterministic table extraction...');
    
    // 2. Deterministic Parsing & Unit Normalization (Mocked)
    // If deterministic parsing fails or leaves ambiguities, we route to AI fallback.
    const hasAmbiguities = true; 

    if (hasAmbiguities) {
      this.logger.log('Ambiguities found in deterministic parsing, routing to AI fallback...');
      
      const useCase: AIUseCase = 'LAB_REPORT_EXTRACTION';
      const context = {
        documentId,
        patientId,
        organizationId,
        extractedText,
        pipelineStage: 'AI_FALLBACK_RESOLUTION',
      };

      // 3. Delegate to AI Orchestrator
      return this.orchestrator.processJob(useCase, organizationId, requestedBy, context);
    }

    // In a real implementation, if no ambiguities, we would just write the AIExtractionResult 
    // directly without a model run.
    return { status: 'COMPLETED', method: 'DETERMINISTIC_ONLY' };
  }
}
