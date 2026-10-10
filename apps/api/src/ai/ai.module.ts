import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AiGatewayService } from './ai-gateway/ai-gateway.service.js';
import { ModelRegistryService } from './model-registry/model-registry.service.js';
import { CaseModelRouterService } from './case-model-router/case-model-router.service.js';
import { PromptRegistryService } from './prompt-registry/prompt-registry.service.js';
import { SchemaRegistryService } from './schema-registry/schema-registry.service.js';
import { OpenAiCompatibleProvider } from './providers/openai-compatible.provider.js';
import { AiConfigService } from './ai-config.service.js';
import { AiOrchestratorModule } from './orchestrator/ai-orchestrator.module.js';
import { DocumentPipelineModule } from './pipelines/document/document-pipeline.module.js';
import { LabReportPipelineModule } from './pipelines/lab-report/lab-report-pipeline.module.js';
import { ImagingBridgeModule } from './imaging-bridge/imaging-bridge.module.js';

@Module({
  imports: [ConfigModule, AiOrchestratorModule, DocumentPipelineModule, LabReportPipelineModule, ImagingBridgeModule],
  providers: [
    AiConfigService,
    AiGatewayService, 
    ModelRegistryService, 
    CaseModelRouterService, 
    PromptRegistryService, 
    SchemaRegistryService,
    OpenAiCompatibleProvider
  ],
  exports: [
    AiConfigService,
    AiGatewayService,
    ModelRegistryService,
    CaseModelRouterService,
    PromptRegistryService,
    SchemaRegistryService,
    AiOrchestratorModule,
    DocumentPipelineModule,
    LabReportPipelineModule,
    ImagingBridgeModule
  ]
})
export class AiModule {}
