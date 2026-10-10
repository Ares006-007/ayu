import { PromptDefinition, AIUseCase } from '../types.js';
export declare class PromptRegistryService {
    private readonly logger;
    private readonly prompts;
    constructor();
    private registerBuiltInPrompts;
    getPrompt(useCase: AIUseCase): PromptDefinition;
}
