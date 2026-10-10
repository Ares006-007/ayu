import { Injectable, Logger } from '@nestjs/common';
import { ModelRegistryService } from '../model-registry/model-registry.service.js';

export type AIUseCase = 
  | 'DOCUMENT_CLASSIFICATION'
  | 'PRESCRIPTION_IMAGE_EXTRACTION'
  | 'PRESCRIPTION_PDF_EXTRACTION'
  | 'MEDICAL_REPORT_EXTRACTION'
  | 'PATIENT_TIMELINE_SUMMARY'
  | 'DOCTOR_CLINICAL_SUMMARY'
  | 'AYUSH_PATIENT_RESPONSE'
  | 'AYUSH_ADMINISTRATIVE_RESPONSE'
  | 'GENERAL_NON_CLINICAL_TEXT';

interface RouteResult {
  primaryModelId: string;
  secondaryModelId?: string;
  reviewerModelId?: string;
}

@Injectable()
export class CaseModelRouterService {
  private readonly logger = new Logger(CaseModelRouterService.name);

  constructor(private readonly modelRegistry: ModelRegistryService) {}

  /**
   * Routes a use case to the appropriate deterministic model IDs based on policy.
   */
  async getRouteForUseCase(useCase: AIUseCase): Promise<RouteResult> {
    this.logger.log(`Routing for use case: ${useCase}`);

    switch (useCase) {
      case 'DOCUMENT_CLASSIFICATION':
        return {
          primaryModelId: await this.modelRegistry.resolveModelId('fast-classifier'),
        };
      case 'PRESCRIPTION_IMAGE_EXTRACTION':
        return {
          primaryModelId: await this.modelRegistry.resolveModelId('document-vision-primary'),
          secondaryModelId: await this.modelRegistry.resolveModelId('open-vision-secondary'),
          reviewerModelId: await this.modelRegistry.resolveModelId('medical-text-reviewer'),
        };
      case 'PRESCRIPTION_PDF_EXTRACTION':
        return {
          primaryModelId: await this.modelRegistry.resolveModelId('document-vision-primary'),
          secondaryModelId: await this.modelRegistry.resolveModelId('long-document-primary'),
          reviewerModelId: await this.modelRegistry.resolveModelId('medical-text-primary'),
        };
      case 'MEDICAL_REPORT_EXTRACTION':
        return {
          primaryModelId: await this.modelRegistry.resolveModelId('document-vision-primary'),
          secondaryModelId: await this.modelRegistry.resolveModelId('long-document-primary'),
          reviewerModelId: await this.modelRegistry.resolveModelId('medical-text-primary'),
        };
      case 'PATIENT_TIMELINE_SUMMARY':
      case 'DOCTOR_CLINICAL_SUMMARY':
        return {
          primaryModelId: await this.modelRegistry.resolveModelId('medical-text-primary'),
        };
      case 'AYUSH_PATIENT_RESPONSE':
      case 'AYUSH_ADMINISTRATIVE_RESPONSE':
      case 'GENERAL_NON_CLINICAL_TEXT':
        return {
          primaryModelId: await this.modelRegistry.resolveModelId('general-text-fallback'),
        };
      default:
        this.logger.warn(`Unknown use case ${useCase}. Routing to general fallback.`);
        return {
          primaryModelId: await this.modelRegistry.resolveModelId('general-text-fallback'),
        };
    }
  }
}
