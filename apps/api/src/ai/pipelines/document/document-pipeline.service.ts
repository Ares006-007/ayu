import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { AiOrchestratorService } from '../../orchestrator/ai-orchestrator.service.js';
import { AIUseCase } from '../../types.js';

@Injectable()
export class DocumentPipelineService {
  private readonly logger = new Logger(DocumentPipelineService.name);

  constructor(private readonly orchestrator: AiOrchestratorService) {}

  /**
   * Main entry point for document processing pipeline.
   * In a real implementation, this would fetch the document from S3/blob storage,
   * run MIME type validation, perform local OCR or text extraction, 
   * and then pass the extracted text to the AI orchestrator.
   */
  async processDocument(
    documentId: string,
    fileBuffer: Buffer,
    mimeType: string,
    organizationId: string,
    requestedBy: string,
    patientId?: string
  ) {
    this.logger.log(`Starting document pipeline for document ${documentId}`);

    // 1. MIME Validation
    const allowedMimeTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!allowedMimeTypes.includes(mimeType)) {
      throw new HttpException(`Unsupported file type: ${mimeType}`, HttpStatus.UNSUPPORTED_MEDIA_TYPE);
    }

    // 2. Type Detection & Routing Logic (Mocked logic)
    let useCase: AIUseCase = 'GENERAL_NON_CLINICAL_TEXT';
    let extractedText = '';

    // Mock local OCR / text extraction
    if (mimeType === 'application/pdf') {
      extractedText = 'Mock extracted PDF text...';
      useCase = 'PRESCRIPTION_PDF_EXTRACTION';
    } else if (mimeType.startsWith('image/')) {
      extractedText = 'Mock OCR text from image...';
      useCase = 'PRESCRIPTION_IMAGE_EXTRACTION';
    }

    // 3. Delegate to AI Orchestrator
    const context = {
      documentId,
      patientId,
      organizationId,
      extractedText, // The prompt will utilize this
      mimeType,
    };

    return this.orchestrator.processJob(useCase, organizationId, requestedBy, context);
  }
}
