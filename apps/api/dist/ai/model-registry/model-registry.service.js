var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var ModelRegistryService_1;
import { Injectable, Logger } from '@nestjs/common';
import { AiConfigService } from '../ai-config.service.js';
import { PrismaService } from '../../database/database.module.js';
let ModelRegistryService = ModelRegistryService_1 = class ModelRegistryService {
    aiConfigService;
    prisma;
    logger = new Logger(ModelRegistryService_1.name);
    constructor(aiConfigService, prisma) {
        this.aiConfigService = aiConfigService;
        this.prisma = prisma;
    }
    async resolveModelId(alias) {
        const routingTable = {
            'ORCHESTRATOR_PRIMARY': 'openai/gpt-5-nano',
            'ORCHESTRATOR_FALLBACK': 'openai/gpt-4o-mini',
            'FAST_CLASSIFIER': 'openai/gpt-5-nano',
            'MEDICAL_TEXT_PRIMARY': 'inclusionai/ling-3.0-flash-sante',
            'MEDICAL_TEXT_REVIEWER': 'openai/gpt-5.5-pro',
            'MEDICAL_TEXT_FALLBACK': 'openai/gpt-4o-mini',
            'DOCUMENT_VISION_PRIMARY': 'inclusionai/ling-3.0-flash-vl',
            'DOCUMENT_VISION_SECONDARY': 'qwen/qwen3-vl-8b-instruct',
            'DOCUMENT_VISION_REVIEWER': 'z-ai/glm-5v-turbo',
            'HIGH_RISK_REVIEWER': 'openai/gpt-6-astra',
            'OPEN_VISION_SECONDARY': 'qwen/qwen3-vl-8b-instruct',
            'LONG_DOCUMENT_PRIMARY': 'meta/muse-spark-1.2',
            'LONG_DOCUMENT_FALLBACK': 'google/gemini-3.8-flash',
            'MEDICINE_NORMALIZATION_PRIMARY': 'inclusionai/ling-3.0-flash-sante',
            'PHARMACY_REVIEW_PRIMARY': 'inclusionai/ling-3.0-flash-sante',
            'CONVERSATION_PRIMARY': 'openai/gpt-4o-mini',
            'CONVERSATION_SECONDARY': 'inclusionai/ling-3.0-flash-sante',
            'CONVERSATION_FALLBACK': 'cohere/command-a',
            'GENERAL_TEXT_FALLBACK': 'cohere/command-a',
            'SAFE_FORMATTER': 'openai/gpt-oss-safeguard-20b',
            'MULTIMODAL_REVIEWER': 'google/gemini-3.8-flash',
            'MULTIMODAL_SECONDARY': 'z-ai/glm-5v-turbo',
            'IMAGING_DRAFT_PRIMARY': 'openai/gpt-5.5-pro',
            'IMAGING_DRAFT_FALLBACK': 'google/gemini-3.8-flash',
            'UNSUPPORTED_PRIMARY': 'openai/gpt-5-nano',
        };
        if (routingTable[alias]) {
            return routingTable[alias];
        }
        const envAliasKey = `AI_MODEL_${alias.toUpperCase().replace(/-/g, '_')}`;
        const modelId = this.aiConfigService.getModelAlias(envAliasKey);
        if (!modelId) {
            this.logger.error(`Failed to resolve model alias: ${alias}. Ensure ${envAliasKey} is set.`);
            throw new Error(`Unresolved model alias: ${alias}`);
        }
        return modelId;
    }
};
ModelRegistryService = ModelRegistryService_1 = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [AiConfigService,
        PrismaService])
], ModelRegistryService);
export { ModelRegistryService };
//# sourceMappingURL=model-registry.service.js.map