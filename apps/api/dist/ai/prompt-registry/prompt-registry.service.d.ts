export interface PromptDefinition {
    id: string;
    version: string;
    useCase: string;
    systemPrompt: string;
    approvalStatus: 'APPROVED' | 'DRAFT';
}
export declare class PromptRegistryService {
    private readonly logger;
    private readonly prompts;
    constructor();
    private registerBuiltInPrompts;
    getPrompt(useCase: string): PromptDefinition;
}
