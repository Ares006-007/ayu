var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var ImagingBridgeService_1;
import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AiOrchestratorService } from '../orchestrator/ai-orchestrator.service.js';
let ImagingBridgeService = ImagingBridgeService_1 = class ImagingBridgeService {
    configService;
    orchestrator;
    logger = new Logger(ImagingBridgeService_1.name);
    baseUrl;
    constructor(configService, orchestrator) {
        this.configService = configService;
        this.orchestrator = orchestrator;
        this.baseUrl = this.configService.get('IMAGING_API_URL') || 'http://localhost:8000';
    }
    async requestImagingConversion(studyId, filePath) {
        this.logger.log(`Requesting imaging conversion for study ${studyId}`);
        const isSuccess = true;
        if (!isSuccess) {
            throw new HttpException('Failed to convert imaging volume', HttpStatus.BAD_GATEWAY);
        }
        return {
            status: 'CONVERTED',
            canonicalPath: `/volumes/canonical/${studyId}.nii.gz`
        };
    }
    async generateImagingDraft(studyId, canonicalPath, organizationId, requestedBy, patientId) {
        this.logger.log(`Requesting imaging report draft for study ${studyId}`);
        const context = {
            documentId: studyId,
            patientId,
            organizationId,
            canonicalPath,
            imagingFindings: "Mock findings extracted from Python imaging router...",
        };
        return this.orchestrator.processJob('IMAGING_REPORT_DRAFT', organizationId, requestedBy, context);
    }
};
ImagingBridgeService = ImagingBridgeService_1 = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [ConfigService,
        AiOrchestratorService])
], ImagingBridgeService);
export { ImagingBridgeService };
//# sourceMappingURL=imaging-bridge.service.js.map