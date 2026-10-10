import { Injectable, Logger } from '@nestjs/common';
import { AiConfigService } from '../ai-config.service.js';
import { PrismaService } from '../../database/database.module.js';

@Injectable()
export class ModelRegistryService {
  private readonly logger = new Logger(ModelRegistryService.name);

  constructor(
    private readonly aiConfigService: AiConfigService,
    private readonly prisma: PrismaService,
  ) {}

  /**
   * Resolves a model alias (e.g. 'medical-text-primary') to its configured provider model ID.
   * Throws an error if the model alias is not configured or disabled.
   */
  async resolveModelId(alias: string): Promise<string> {
    // Hardcoded approved routing table (Agent to Model Mapping)
    const routingTable: Record<string, string> = {
      // 1. Orchestrator Agent
      'ORCHESTRATOR_PRIMARY': 'openai/gpt-5-nano',
      'ORCHESTRATOR_FALLBACK': 'openai/gpt-4o-mini',
      'FAST_CLASSIFIER': 'openai/gpt-5-nano',

      // 2. Medical Text Reasoning Agent
      'MEDICAL_TEXT_PRIMARY': 'inclusionai/ling-3.0-flash-sante',
      'MEDICAL_TEXT_REVIEWER': 'openai/gpt-5.5-pro',
      'MEDICAL_TEXT_FALLBACK': 'openai/gpt-4o-mini',

      // 3. Document Vision Agent & 5. Lab Report
      'DOCUMENT_VISION_PRIMARY': 'inclusionai/ling-3.0-flash-vl',
      'DOCUMENT_VISION_SECONDARY': 'qwen/qwen3-vl-8b-instruct',
      'DOCUMENT_VISION_REVIEWER': 'z-ai/glm-5v-turbo',
      'HIGH_RISK_REVIEWER': 'openai/gpt-6-astra',
      'OPEN_VISION_SECONDARY': 'qwen/qwen3-vl-8b-instruct',

      // 4. Long Document Agent
      'LONG_DOCUMENT_PRIMARY': 'meta/muse-spark-1.2',
      'LONG_DOCUMENT_FALLBACK': 'google/gemini-3.8-flash',

      // 6. Medicine Normalization Agent / 7. Patient Summary / 8. Pharmacy Review
      'MEDICINE_NORMALIZATION_PRIMARY': 'inclusionai/ling-3.0-flash-sante',
      'PHARMACY_REVIEW_PRIMARY': 'inclusionai/ling-3.0-flash-sante',

      // 9. AYUSH Conversation Agent
      'CONVERSATION_PRIMARY': 'openai/gpt-4o-mini',
      'CONVERSATION_SECONDARY': 'inclusionai/ling-3.0-flash-sante',
      'CONVERSATION_FALLBACK': 'cohere/command-a',
      'GENERAL_TEXT_FALLBACK': 'cohere/command-a',

      // 10. Safe Formatter Agent
      'SAFE_FORMATTER': 'openai/gpt-oss-safeguard-20b',

      // 11. Multimodal Review Agent
      'MULTIMODAL_REVIEWER': 'google/gemini-3.8-flash',
      'MULTIMODAL_SECONDARY': 'z-ai/glm-5v-turbo',

      // 12. Imaging Report Draft Agent
      'IMAGING_DRAFT_PRIMARY': 'openai/gpt-5.5-pro',
      'IMAGING_DRAFT_FALLBACK': 'google/gemini-3.8-flash',

      // 13. Unsupported / High Risk
      'UNSUPPORTED_PRIMARY': 'openai/gpt-5-nano',
    };

    if (routingTable[alias]) {
      return routingTable[alias];
    }

    // Fallback to env config if not in the hardcoded table
    const envAliasKey = `AI_MODEL_${alias.toUpperCase().replace(/-/g, '_')}`;
    const modelId = this.aiConfigService.getModelAlias(envAliasKey);

    if (!modelId) {
      this.logger.error(`Failed to resolve model alias: ${alias}. Ensure ${envAliasKey} is set.`);
      throw new Error(`Unresolved model alias: ${alias}`);
    }

    return modelId;
  }
}
