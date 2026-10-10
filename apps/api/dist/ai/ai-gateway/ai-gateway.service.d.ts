import { AiConfigService } from '../ai-config.service.js';
import { OpenAiCompatibleProvider } from '../providers/openai-compatible.provider.js';
import { TextGenerationRequest, TextGenerationResult, StructuredGenerationRequest, StructuredGenerationResult } from '../providers/ai-provider.interface.js';
export declare class AiGatewayService {
    private readonly aiConfigService;
    private readonly provider;
    private readonly logger;
    constructor(aiConfigService: AiConfigService, provider: OpenAiCompatibleProvider);
    generateText(request: TextGenerationRequest): Promise<TextGenerationResult>;
    generateStructured<T>(request: StructuredGenerationRequest, schema: Record<string, any>): Promise<StructuredGenerationResult<T>>;
}
