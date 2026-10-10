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