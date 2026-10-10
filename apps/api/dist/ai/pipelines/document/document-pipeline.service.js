var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var DocumentPipelineService_1;
import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { AiOrchestratorService } from '../../orchestrator/ai-orchestrator.service.js';
let DocumentPipelineService = DocumentPipelineService_1 = class DocumentPipelineService {
    orchestrator;
    logger = new Logger(DocumentPipelineService_1.name);
    constructor(orchestrator) {
        this.orchestrator = orchestrator;
    }
    async processDocument(documentId, fileBuffer, mimeType, organizationId, requestedBy, patientId) {
        this.logger.log(`Starting document pipeline for document ${documentId}`);
        const allowedMimeTypes = ['application/pdf', 'image/jpeg', 'image/png'];
        if (!allowedMimeTypes.includes(mimeType)) {
            throw new HttpException(`Unsupported file type: ${mimeType}`, HttpStatus.UNSUPPORTED_MEDIA_TYPE);
        }
        let useCase = 'GENERAL_NON_CLINICAL_TEXT';
        let extractedText = '';
        if (mimeType === 'application/pdf') {
            extractedText = 'Mock extracted PDF text...';
            useCase = 'PRESCRIPTION_PDF_EXTRACTION';
        }
        else if (mimeType.startsWith('image/')) {
            extractedText = 'Mock OCR text from image...';
            useCase = 'PRESCRIPTION_IMAGE_EXTRACTION';
        }
        const context = {
            documentId,
            patientId,
            organizationId,
            extractedText,
            mimeType,
        };
        return this.orchestrator.processJob(useCase, organizationId, requestedBy, context);
    }
};
DocumentPipelineService = DocumentPipelineService_1 = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [AiOrchestratorService])
], DocumentPipelineService);
export { DocumentPipelineService };
//# sourceMappingURL=document-pipeline.service.js.map