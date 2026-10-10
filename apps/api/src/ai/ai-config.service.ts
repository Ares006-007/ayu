import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AiConfigService implements OnModuleInit {
  private readonly logger = new Logger(AiConfigService.name);

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    this.validateConfig();
  }

  private validateConfig() {
    const requiredVars = [
      'AI_GATEWAY_BASE_URL',
      'AI_GATEWAY_API_KEY',
      'AI_GATEWAY_ENABLED',
      'AI_PHI_PROCESSING_APPROVED',
      'AI_MODEL_MEDICAL_TEXT_PRIMARY',
      'AI_MODEL_DOCUMENT_VISION_PRIMARY'
    ];

    for (const v of requiredVars) {
      if (!this.configService.get(v)) {
        throw new Error(`AI Configuration Error: Missing required environment variable ${v}`);
      }
    }

    if (this.configService.get('AI_GATEWAY_LOG_PAYLOADS') === 'true') {
      throw new Error(`AI Configuration Error: AI_GATEWAY_LOG_PAYLOADS must not be enabled in production.`);
    }

    if (this.configService.get('AI_GATEWAY_API_KEY') === '<REPLACE_IN_VAULT>') {
       throw new Error(`AI Configuration Error: Exposed API Key must not be used.`);
    }

    this.logger.log('AI configuration validated successfully.');
  }

  get gatewayBaseUrl(): string {
    return this.configService.get<string>('AI_GATEWAY_BASE_URL')!;
  }

  get gatewayApiKey(): string {
    return this.configService.get<string>('AI_GATEWAY_API_KEY')!;
  }

  get isGatewayEnabled(): boolean {
    return this.configService.get<string>('AI_GATEWAY_ENABLED') === 'true';
  }

  getModelAlias(alias: string): string | undefined {
    return this.configService.get<string>(alias);
  }
}
