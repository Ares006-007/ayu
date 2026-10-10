var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AiConfigService_1;
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
let AiConfigService = AiConfigService_1 = class AiConfigService {
    configService;
    logger = new Logger(AiConfigService_1.name);
    constructor(configService) {
        this.configService = configService;
    }
    onModuleInit() {
        this.validateConfig();
    }
    validateConfig() {
        const requiredVars = [
            'AI_GATEWAY_BASE_URL',
            'AI_GATEWAY_API_KEY',
            'AI_GATEWAY_ENABLED',
            'AI_PHI_PROCESSING_APPROVED',
            'AI_MODEL_MEDICAL_TEXT_PRIMARY',
            'AI_MODEL_DOCUMENT_VISION_PRIMARY'
        ];
        for (const v of requiredVars) {
            if (!this.configService.get(v)) {
                throw new Error(`AI Configuration Error: Missing required environment variable ${v}`);
            }
        }
        if (this.configService.get('AI_GATEWAY_LOG_PAYLOADS') === 'true') {
            throw new Error(`AI Configuration Error: AI_GATEWAY_LOG_PAYLOADS must not be enabled in production.`);
        }
        if (this.configService.get('AI_GATEWAY_API_KEY') === '<REPLACE_IN_VAULT>') {
            throw new Error(`AI Configuration Error: Exposed API Key must not be used.`);
        }
        this.logger.log('AI configuration validated successfully.');
    }
    get gatewayBaseUrl() {
        return this.configService.get('AI_GATEWAY_BASE_URL');
    }
    get gatewayApiKey() {
        return this.configService.get('AI_GATEWAY_API_KEY');
    }
    get isGatewayEnabled() {
        return this.configService.get('AI_GATEWAY_ENABLED') === 'true';
    }
    getModelAlias(alias) {
        return this.configService.get(alias);
    }
};
AiConfigService = AiConfigService_1 = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [ConfigService])
], AiConfigService);
export { AiConfigService };
//# sourceMappingURL=ai-config.service.js.map