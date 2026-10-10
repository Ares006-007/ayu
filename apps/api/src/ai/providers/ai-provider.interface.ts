export interface AIProviderConfig {
  baseUrl: string;
  apiKey: string;
  timeoutMs?: number;
}

export interface TextGenerationRequest {
  model: string;
  systemPrompt: string;
  userPrompt: string;
  maxTokens?: number;
  temperature?: number;
}

export interface TextGenerationResult {
  text: string;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  model: string;
}

export interface StructuredGenerationRequest {
  model: string;
  systemPrompt: string;
  userPrompt: string;
}

export interface StructuredGenerationResult<T> {
  data: T;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  model: string;
}

export interface ProviderHealth {
  status: 'UP' | 'DOWN';
  latencyMs?: number;
  error?: string;
}

export interface AIProvider {
  generateText(request: TextGenerationRequest): Promise<TextGenerationResult>;
  generateStructured<T>(
    request: StructuredGenerationRequest,
    schema: Record<string, any>,
  ): Promise<StructuredGenerationResult<T>>;
  healthCheck(): Promise<ProviderHealth>;
}
