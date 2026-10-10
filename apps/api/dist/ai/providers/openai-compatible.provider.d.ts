import { AiConfigService } from '../ai-config.service.js';
import { AIProvider, TextGenerationRequest, TextGenerationResult, StructuredGenerationRequest, StructuredGenerationResult, ProviderHealth } from './ai-provider.interface.js';
export declare class OpenAiCompatibleProvider implements AIProvider {
    private readonly config;
    private readonly logger;
    constructor(config: AiConfigService);
    generateText(request: TextGenerationRequest): Promise<TextGenerationResult>;
    generateStructured<T>(request: StructuredGenerationRequest, schema: Record<string, any>): Promise<StructuredGenerationResult<T>>;
    healthCheck(): Promise<ProviderHealth>;
}
