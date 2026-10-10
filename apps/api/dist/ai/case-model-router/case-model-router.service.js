var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var CaseModelRouterService_1;
import { Injectable, Logger } from '@nestjs/common';
import { ModelRegistryService } from '../model-registry/model-registry.service.js';
let CaseModelRouterService = CaseModelRouterService_1 = class CaseModelRouterService {
    modelRegistry;
    logger = new Logger(CaseModelRouterService_1.name);
    constructor(modelRegistry) {
        this.modelRegistry = modelRegistry;
    }
    async getRouteForUseCase(useCase) {
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
                    localParsingFirst: true,
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
                    humanReviewPolicy: 'CONDITIONAL',
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
                    localParsingFirst: true,
                    rejectAutomated: false,
                };
            case 'AYUSH_PATIENT_RESPONSE':
                return {
                    useCase,
                    primaryModelAlias: 'SAFE_FORMATTER',
                    humanReviewPolicy: 'NONE',
                    localParsingFirst: true,
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
                    primaryModelAlias: 'MEDICAL_TEXT_PRIMARY',
                    humanReviewPolicy: 'REQUIRED',
                    localParsingFirst: true,
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
                    rejectAutomated: true,
                };
        }
    }
};
CaseModelRouterService = CaseModelRouterService_1 = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [ModelRegistryService])
], CaseModelRouterService);
export { CaseModelRouterService };
//# sourceMappingURL=case-model-router.service.js.map