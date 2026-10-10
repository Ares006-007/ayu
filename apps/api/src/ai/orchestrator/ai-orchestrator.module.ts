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

@Module({
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
export class AiOrchestratorModule {}
