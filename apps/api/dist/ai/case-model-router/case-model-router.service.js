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
};
CaseModelRouterService = CaseModelRouterService_1 = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [ModelRegistryService])
], CaseModelRouterService);
export { CaseModelRouterService };
//# sourceMappingURL=case-model-router.service.js.map