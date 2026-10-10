import { Module } from '@nestjs/common';
import { LabReportPipelineService } from './lab-report-pipeline.service.js';
import { AiOrchestratorModule } from '../../orchestrator/ai-orchestrator.module.js';

@Module({
  imports: [AiOrchestratorModule],
  providers: [LabReportPipelineService],
  exports: [LabReportPipelineService],
})
export class LabReportPipelineModule {}
