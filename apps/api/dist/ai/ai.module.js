var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
let AiModule = class AiModule {
};
AiModule = __decorate([
    Module({
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
], AiModule);
export { AiModule };
//# sourceMappingURL=ai.module.js.map