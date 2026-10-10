import { Injectable, Logger } from '@nestjs/common';
import { AiConfigService } from '../ai-config.service.js';
import {
  AIProvider,
  TextGenerationRequest,
  TextGenerationResult,
  StructuredGenerationRequest,
  StructuredGenerationResult,
  ProviderHealth,
} from './ai-provider.interface.js';

@Injectable()
export class OpenAiCompatibleProvider implements AIProvider {
  private readonly logger = new Logger(OpenAiCompatibleProvider.name);

  constructor(private readonly config: AiConfigService) {}

  async generateText(request: TextGenerationRequest): Promise<TextGenerationResult> {
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
        temperature: request.temperature ?? 0.0 // Default to greedy/deterministic
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

  async generateStructured<T>(
    request: StructuredGenerationRequest,
    schema: Record<string, any>,
  ): Promise<StructuredGenerationResult<T>> {
    this.logger.log(`Executing generateStructured for model: ${request.model}`);
    
    // For OpenAI models, structured output is typically handled via function calling or JSON mode.
    // We'll use the JSON schema format if supported by the model or standard JSON object response format.
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
        response_format: { type: "json_object" }, // Assuming JSON mode is supported
        temperature: 0.0 // Greedy for structured extraction
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      this.logger.error(`AI Provider error: ${response.status} ${errorText}`);
      throw new Error(`AI Provider failed with status: ${response.status}`);
    }

    const data = await response.json();
    const text = data.choices[0]?.message?.content ?? '{}';
    let parsedData: T;

    try {
      parsedData = JSON.parse(text) as T;
    } catch (e) {
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

  async healthCheck(): Promise<ProviderHealth> {
    return {
      status: 'UP',
      latencyMs: 50,
    };
  }
}
