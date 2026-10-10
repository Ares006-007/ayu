var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var OpenAiCompatibleProvider_1;
import { Injectable, Logger } from '@nestjs/common';
import { AiConfigService } from '../ai-config.service.js';
let OpenAiCompatibleProvider = OpenAiCompatibleProvider_1 = class OpenAiCompatibleProvider {
    config;
    logger = new Logger(OpenAiCompatibleProvider_1.name);
    constructor(config) {
        this.config = config;
    }
    async generateText(request) {
        this.logger.log(`Executing generateText for model: ${request.model}`);
        const response = await fetch(`${this.config.gatewayBaseUrl}/chat/completions`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.config.gatewayApiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: request.model,
                messages: [
                    { role: 'system', content: request.systemPrompt },
                    { role: 'user', content: request.userPrompt }
                ],
                max_tokens: request.maxTokens,
                temperature: request.temperature ?? 0.0
            })
        });
        if (!response.ok) {
            const errorText = await response.text();
            this.logger.error(`AI Provider error: ${response.status} ${errorText}`);
            throw new Error(`AI Provider failed with status: ${response.status}`);
        }
        const data = await response.json();
        const text = data.choices[0]?.message?.content ?? '';
        return {
            text,
            promptTokens: data.usage?.prompt_tokens ?? 0,
            completionTokens: data.usage?.completion_tokens ?? 0,
            totalTokens: data.usage?.total_tokens ?? 0,
            model: data.model ?? request.model,
        };
    }
    async generateStructured(request, schema) {
        this.logger.log(`Executing generateStructured for model: ${request.model}`);
        const response = await fetch(`${this.config.gatewayBaseUrl}/chat/completions`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.config.gatewayApiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: request.model,
                messages: [
                    { role: 'system', content: request.systemPrompt },
                    { role: 'user', content: request.userPrompt }
                ],
                response_format: { type: "json_object" },
                temperature: 0.0
            })
        });
        if (!response.ok) {
            const errorText = await response.text();
            this.logger.error(`AI Provider error: ${response.status} ${errorText}`);
            throw new Error(`AI Provider failed with status: ${response.status}`);
        }
        const data = await response.json();
        const text = data.choices[0]?.message?.content ?? '{}';
        let parsedData;
        try {
            parsedData = JSON.parse(text);
        }
        catch (e) {
            this.logger.error('Failed to parse JSON from structured output response');
            throw new Error('Invalid JSON received from AI provider');
        }
        return {
            data: parsedData,
            promptTokens: data.usage?.prompt_tokens ?? 0,
            completionTokens: data.usage?.completion_tokens ?? 0,
            totalTokens: data.usage?.total_tokens ?? 0,
            model: data.model ?? request.model,
        };
    }
    async healthCheck() {
        return {
            status: 'UP',
            latencyMs: 50,
        };
    }
};
OpenAiCompatibleProvider = OpenAiCompatibleProvider_1 = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [AiConfigService])
], OpenAiCompatibleProvider);
export { OpenAiCompatibleProvider };
//# sourceMappingURL=openai-compatible.provider.js.map