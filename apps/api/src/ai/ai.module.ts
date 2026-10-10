import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AiGatewayService } from './ai-gateway/ai-gateway.service.js';
import { ModelRegistryService } from './model-registry/model-registry.service.js';
import { CaseModelRouterService } from './case-model-router/case-model-router.service.js';
import { PromptRegistryService } from './prompt-registry/prompt-registry.service.js';
import { SchemaRegistryService } from './schema-registry/schema-registry.service.js';
import { OpenAiCompatibleProvider } from './providers/openai-compatible.provider.js';
import { AiConfigService } from './ai-config.service.js';

@Module({
  imports: [ConfigModule],
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
    SchemaRegistryService
  ]
})
export class AiModule {}
