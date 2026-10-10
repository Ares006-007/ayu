import { Injectable, Logger } from '@nestjs/common';
import { ModelRegistryService } from '../model-registry/model-registry.service.js';
import { AIUseCase, RouteResult } from '../types.js';

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
          useCase,
          primaryModelAlias: 'FAST_CLASSIFIER',
          humanReviewPolicy: 'NONE',
          localParsingFirst: true,
          rejectAutomated: false,
        };
      case 'PRESCRIPTION_IMAGE_EXTRACTION':
        return {
          useCase,
          primaryModelAlias: 'DOCUMENT_VISION_PRIMARY',
          secondaryModelAlias: 'OPEN_VISION_SECONDARY',
          reviewerModelAlias: 'MEDICAL_TEXT_REVIEWER',
          humanReviewPolicy: 'REQUIRED',
          localParsingFirst: false,
          rejectAutomated: false,
        };
      case 'PRESCRIPTION_PDF_EXTRACTION':
        return {
          useCase,
          primaryModelAlias: 'DOCUMENT_VISION_PRIMARY',
          secondaryModelAlias: 'LONG_DOCUMENT_PRIMARY',
          reviewerModelAlias: 'MEDICAL_TEXT_PRIMARY',
          humanReviewPolicy: 'REQUIRED',
          localParsingFirst: true,
          rejectAutomated: false,
        };
      case 'HANDWRITTEN_PRESCRIPTION_EXTRACTION':
        return {
          useCase,
          primaryModelAlias: 'DOCUMENT_VISION_PRIMARY',
          secondaryModelAlias: 'OPEN_VISION_SECONDARY',
          reviewerModelAlias: 'HIGH_RISK_REVIEWER',
          humanReviewPolicy: 'REQUIRED',
          localParsingFirst: false,
          rejectAutomated: false,
        };
      case 'MEDICAL_REPORT_EXTRACTION':
        return {
          useCase,
          primaryModelAlias: 'DOCUMENT_VISION_PRIMARY',
          secondaryModelAlias: 'LONG_DOCUMENT_PRIMARY',
          reviewerModelAlias: 'MEDICAL_TEXT_PRIMARY',
          humanReviewPolicy: 'REQUIRED',
          localParsingFirst: true,
          rejectAutomated: false,
        };
      case 'LAB_REPORT_EXTRACTION':
        return {
          useCase,
          primaryModelAlias: 'DOCUMENT_VISION_PRIMARY',
          reviewerModelAlias: 'MEDICAL_TEXT_PRIMARY',
          humanReviewPolicy: 'REQUIRED',
          localParsingFirst: true, // Deterministic parsing first
          rejectAutomated: false,
        };
      case 'DISCHARGE_SUMMARY_EXTRACTION':
        return {
          useCase,
          primaryModelAlias: 'LONG_DOCUMENT_PRIMARY',
          reviewerModelAlias: 'MEDICAL_TEXT_PRIMARY',
          humanReviewPolicy: 'CONDITIONAL',
          localParsingFirst: true,
          rejectAutomated: false,
        };
      case 'LONG_MEDICAL_DOCUMENT_SUMMARY':
        return {
          useCase,
          primaryModelAlias: 'LONG_DOCUMENT_PRIMARY',
          reviewerModelAlias: 'MEDICAL_TEXT_PRIMARY',
          humanReviewPolicy: 'CONDITIONAL',
          localParsingFirst: true,
          rejectAutomated: false,
        };
      case 'PATIENT_TIMELINE_SUMMARY':
        return {
          useCase,
          primaryModelAlias: 'MEDICAL_TEXT_PRIMARY',
          humanReviewPolicy: 'OPTIONAL',
          localParsingFirst: false,
          rejectAutomated: false,
        };
      case 'DOCTOR_CLINICAL_SUMMARY':
        return {
          useCase,
          primaryModelAlias: 'MEDICAL_TEXT_PRIMARY',
          reviewerModelAlias: 'MEDICAL_TEXT_REVIEWER',
          humanReviewPolicy: 'CONDITIONAL', // when risk is high
          localParsingFirst: false,
          rejectAutomated: false,
        };
      case 'PHARMACY_PRESCRIPTION_REVIEW':
        return {
          useCase,
          primaryModelAlias: 'MEDICAL_TEXT_PRIMARY',
          humanReviewPolicy: 'OPTIONAL',
          localParsingFirst: false,
          rejectAutomated: false,
        };
      case 'MEDICINE_NAME_NORMALIZATION':
        return {
          useCase,
          primaryModelAlias: 'MEDICAL_TEXT_PRIMARY',
          humanReviewPolicy: 'NONE',
          localParsingFirst: true, // Deterministic catalog matching first
          rejectAutomated: false,
        };
      case 'AYUSH_PATIENT_RESPONSE':
        return {
          useCase,
          primaryModelAlias: 'SAFE_FORMATTER', // or GENERAL_TEXT_FALLBACK
          humanReviewPolicy: 'NONE',
          localParsingFirst: true, // Deterministic templates first
          rejectAutomated: false,
        };
      case 'AYUSH_ADMINISTRATIVE_RESPONSE':
        return {
          useCase,
          primaryModelAlias: 'GENERAL_TEXT_FALLBACK',
          humanReviewPolicy: 'NONE',
          localParsingFirst: false,
          rejectAutomated: false,
        };
      case 'IMAGING_REPORT_DRAFT':
        return {
          useCase,
          primaryModelAlias: 'MEDICAL_TEXT_PRIMARY', // or MULTIMODAL_REVIEWER
          humanReviewPolicy: 'REQUIRED',
          localParsingFirst: true, // Structured imaging outputs only
          rejectAutomated: false,
        };
      case 'GENERAL_NON_CLINICAL_TEXT':
        return {
          useCase,
          primaryModelAlias: 'GENERAL_TEXT_FALLBACK',
          humanReviewPolicy: 'NONE',
          localParsingFirst: false,
          rejectAutomated: false,
        };
      case 'UNSUPPORTED_OR_HIGH_RISK':
      default:
        this.logger.warn(`Routing to UNSUPPORTED_OR_HIGH_RISK. Manual review required.`);
        return {
          useCase: 'UNSUPPORTED_OR_HIGH_RISK',
          primaryModelAlias: 'GENERAL_TEXT_FALLBACK',
          humanReviewPolicy: 'REQUIRED',
          localParsingFirst: false,
          rejectAutomated: true, // Reject automated completion
        };
    }
  }
}
