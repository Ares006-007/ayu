import { ModelRegistryService } from '../model-registry/model-registry.service.js';
export type AIUseCase = 'DOCUMENT_CLASSIFICATION' | 'PRESCRIPTION_IMAGE_EXTRACTION' | 'PRESCRIPTION_PDF_EXTRACTION' | 'MEDICAL_REPORT_EXTRACTION' | 'PATIENT_TIMELINE_SUMMARY' | 'DOCTOR_CLINICAL_SUMMARY' | 'AYUSH_PATIENT_RESPONSE' | 'AYUSH_ADMINISTRATIVE_RESPONSE' | 'GENERAL_NON_CLINICAL_TEXT';
interface RouteResult {
    primaryModelId: string;
    secondaryModelId?: string;
    reviewerModelId?: string;
}
export declare class CaseModelRouterService {
    private readonly modelRegistry;
    private readonly logger;
    constructor(modelRegistry: ModelRegistryService);
    getRouteForUseCase(useCase: AIUseCase): Promise<RouteResult>;
}
export {};
