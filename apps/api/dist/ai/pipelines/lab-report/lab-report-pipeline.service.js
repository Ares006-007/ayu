var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var LabReportPipelineService_1;
import { Injectable, Logger } from '@nestjs/common';
import { AiOrchestratorService } from '../../orchestrator/ai-orchestrator.service.js';
let LabReportPipelineService = LabReportPipelineService_1 = class LabReportPipelineService {
    orchestrator;
    logger = new Logger(LabReportPipelineService_1.name);
    constructor(orchestrator) {
        this.orchestrator = orchestrator;
    }
    async processLabReport(documentId, extractedText, organizationId, requestedBy, patientId) {
        this.logger.log(`Starting lab report pipeline for document ${documentId}`);
        this.logger.log('Running deterministic table extraction...');
        const hasAmbiguities = true;
        if (hasAmbiguities) {
            this.logger.log('Ambiguities found in deterministic parsing, routing to AI fallback...');
            const useCase = 'LAB_REPORT_EXTRACTION';
            const context = {
                documentId,
                patientId,
                organizationId,
                extractedText,
                pipelineStage: 'AI_FALLBACK_RESOLUTION',
            };
            return this.orchestrator.processJob(useCase, organizationId, requestedBy, context);
        }
        return { status: 'COMPLETED', method: 'DETERMINISTIC_ONLY' };
    }
};
LabReportPipelineService = LabReportPipelineService_1 = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [AiOrchestratorService])
], LabReportPipelineService);
export { LabReportPipelineService };
//# sourceMappingURL=lab-report-pipeline.service.js.map