var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AiGatewayService_1;
import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { AiConfigService } from '../ai-config.service.js';
import { OpenAiCompatibleProvider } from '../providers/openai-compatible.provider.js';
let AiGatewayService = AiGatewayService_1 = class AiGatewayService {
    aiConfigService;
    provider;
    logger = new Logger(AiGatewayService_1.name);
    constructor(aiConfigService, provider) {
        this.aiConfigService = aiConfigService;
        this.provider = provider;
    }
    async generateText(request) {
        if (!this.aiConfigService.isGatewayEnabled) {
            throw new HttpException('AI Gateway is disabled', HttpStatus.SERVICE_UNAVAILABLE);
        }
        try {
            this.logger.log(`Routing text generation request for model: ${request.model}`);
            return await this.provider.generateText(request);
        }
        catch (error) {
            this.logger.error(`AI Gateway error for generateText: ${error.message}`, error.stack);
            throw new HttpException('Failed to generate text from AI Provider', HttpStatus.BAD_GATEWAY);
        }
    }
    async generateStructured(request, schema) {
        if (!this.aiConfigService.isGatewayEnabled) {
            throw new HttpException('AI Gateway is disabled', HttpStatus.SERVICE_UNAVAILABLE);
        }
        try {
            this.logger.log(`Routing structured generation request for model: ${request.model}`);
            return await this.provider.generateStructured(request, schema);
        }
        catch (error) {
            this.logger.error(`AI Gateway error for generateStructured: ${error.message}`, error.stack);
            throw new HttpException('Failed to generate structured result from AI Provider', HttpStatus.BAD_GATEWAY);
        }
    }
};
AiGatewayService = AiGatewayService_1 = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [AiConfigService,
        OpenAiCompatibleProvider])
], AiGatewayService);
export { AiGatewayService };
//# sourceMappingURL=ai-gateway.service.js.map