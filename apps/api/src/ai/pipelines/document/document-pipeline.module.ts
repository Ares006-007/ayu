import { Module } from '@nestjs/common';
import { DocumentPipelineService } from './document-pipeline.service.js';
import { AiOrchestratorModule } from '../../orchestrator/ai-orchestrator.module.js';

@Module({
  imports: [AiOrchestratorModule],
  providers: [DocumentPipelineService],
  exports: [DocumentPipelineService],
})
export class DocumentPipelineModule {}
