var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { AiOrchestratorService } from './ai-orchestrator.service.js';
import { DatabaseModule } from '../../database/database.module.js';
import { CaseModelRouterService } from '../case-model-router/case-model-router.service.js';
import { AiGatewayService } from '../ai-gateway/ai-gateway.service.js';
import { PromptRegistryService } from '../prompt-registry/prompt-registry.service.js';
import { SchemaRegistryService } from '../schema-registry/schema-registry.service.js';
import { AiReviewModule } from '../review/ai-review.module.js';
import { ModelRegistryService } from '../model-registry/model-registry.service.js';
import { AiConfigService } from '../ai-config.service.js';
import { OpenAiCompatibleProvider } from '../providers/openai-compatible.provider.js';
let AiOrchestratorModule = class AiOrchestratorModule {
};
AiOrchestratorModule = __decorate([
    Module({
        imports: [DatabaseModule, AiReviewModule],
        providers: [
            AiOrchestratorService,
            CaseModelRouterService,
            AiGatewayService,
            PromptRegistryService,
            SchemaRegistryService,
            ModelRegistryService,
            AiConfigService,
            OpenAiCompatibleProvider,
        ],
        exports: [AiOrchestratorService],
    })
], AiOrchestratorModule);
export { AiOrchestratorModule };
//# sourceMappingURL=ai-orchestrator.module.js.map