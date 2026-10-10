var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var PromptRegistryService_1;
import { Injectable, Logger } from '@nestjs/common';
let PromptRegistryService = PromptRegistryService_1 = class PromptRegistryService {
    logger = new Logger(PromptRegistryService_1.name);
    prompts = new Map();
    constructor() {
        this.registerBuiltInPrompts();
    }
    registerBuiltInPrompts() {
        this.prompts.set('prescription-extraction', {
            id: 'prompt-rx-001',
            version: '1.0.0',
            useCase: 'PRESCRIPTION_IMAGE_EXTRACTION',
            systemPrompt: 'You are a highly constrained medical extraction AI. Extract the fields into the provided schema. Do not diagnose or prescribe.',
            approvalStatus: 'APPROVED',
        });
    }
    getPrompt(useCase) {
        const key = useCase === 'PRESCRIPTION_IMAGE_EXTRACTION' ? 'prescription-extraction' : null;
        if (key && this.prompts.has(key)) {
            return this.prompts.get(key);
        }
        return {
            id: 'prompt-generic-001',
            version: '1.0.0',
            useCase,
            systemPrompt: 'You are a helpful and safe healthcare assistant. Adhere strictly to the JSON schema provided.',
            approvalStatus: 'APPROVED',
        };
    }
};
PromptRegistryService = PromptRegistryService_1 = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [])
], PromptRegistryService);
export { PromptRegistryService };
//# sourceMappingURL=prompt-registry.service.js.map