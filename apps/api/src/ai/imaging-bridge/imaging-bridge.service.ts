import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AiOrchestratorService } from '../orchestrator/ai-orchestrator.service.js';

@Injectable()
export class ImagingBridgeService {
  private readonly logger = new Logger(ImagingBridgeService.name);
  private readonly baseUrl: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly orchestrator: AiOrchestratorService
  ) {
    this.baseUrl = this.configService.get<string>('IMAGING_API_URL') || 'http://localhost:8000';
  }

  /**
   * Calls the FastAPI imaging service to convert a DICOM/NIfTI to canonical formats.
   */
  async requestImagingConversion(studyId: string, filePath: string) {
    this.logger.log(`Requesting imaging conversion for study ${studyId}`);
    
    // Mock HTTP call to imaging-api
    const isSuccess = true;
    if (!isSuccess) {
      throw new HttpException('Failed to convert imaging volume', HttpStatus.BAD_GATEWAY);
    }

    return {
      status: 'CONVERTED',
      canonicalPath: `/volumes/canonical/${studyId}.nii.gz`
    };
  }

  /**
   * Triggers the generation of an AI draft report from imaging outputs
   */
  async generateImagingDraft(
    studyId: string, 
    canonicalPath: string, 
    organizationId: string, 
    requestedBy: string,
    patientId?: string
  ) {
    this.logger.log(`Requesting imaging report draft for study ${studyId}`);
    
    // We delegate the text-generation portion of imaging back to the AI Orchestrator
    const context = {
      documentId: studyId,
      patientId,
      organizationId,
      canonicalPath,
      imagingFindings: "Mock findings extracted from Python imaging router...",
    };

    return this.orchestrator.processJob('IMAGING_REPORT_DRAFT', organizationId, requestedBy, context);
  }
}
