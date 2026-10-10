import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { AiConfigService } from '../ai-config.service.js';
import { OpenAiCompatibleProvider } from '../providers/openai-compatible.provider.js';
import {
  TextGenerationRequest,
  TextGenerationResult,
  StructuredGenerationRequest,
  StructuredGenerationResult,
} from '../providers/ai-provider.interface.js';

@Injectable()
export class AiGatewayService {
  private readonly logger = new Logger(AiGatewayService.name);

  constructor(
    private readonly aiConfigService: AiConfigService,
    private readonly provider: OpenAiCompatibleProvider,
  ) {}

  async generateText(request: TextGenerationRequest): Promise<TextGenerationResult> {
    if (!this.aiConfigService.isGatewayEnabled) {
      throw new HttpException('AI Gateway is disabled', HttpStatus.SERVICE_UNAVAILABLE);
    }

    try {
      this.logger.log(`Routing text generation request for model: ${request.model}`);
      return await this.provider.generateText(request);
    } catch (error) {
      this.logger.error(`AI Gateway error for generateText: ${(error as Error).message}`, (error as Error).stack);
      throw new HttpException('Failed to generate text from AI Provider', HttpStatus.BAD_GATEWAY);
    }
  }

  async generateStructured<T>(
    request: StructuredGenerationRequest,
    schema: Record<string, any>,
  ): Promise<StructuredGenerationResult<T>> {
    if (!this.aiConfigService.isGatewayEnabled) {
      throw new HttpException('AI Gateway is disabled', HttpStatus.SERVICE_UNAVAILABLE);
    }

    try {
      this.logger.log(`Routing structured generation request for model: ${request.model}`);
      return await this.provider.generateStructured<T>(request, schema);
    } catch (error) {
      this.logger.error(`AI Gateway error for generateStructured: ${(error as Error).message}`, (error as Error).stack);
      throw new HttpException('Failed to generate structured result from AI Provider', HttpStatus.BAD_GATEWAY);
    }
  }
}
