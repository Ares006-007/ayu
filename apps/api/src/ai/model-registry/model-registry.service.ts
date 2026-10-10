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
    // In a full implementation, this could check the database for `AIModelDefinition`
    // For now, we rely on the environment variables defined in AiConfigService
    const envAliasKey = `AI_MODEL_${alias.toUpperCase().replace(/-/g, '_')}`;
    const modelId = this.aiConfigService.getModelAlias(envAliasKey);

    if (!modelId) {
      this.logger.error(`Failed to resolve model alias: ${alias}. Ensure ${envAliasKey} is set.`);
      throw new Error(`Unresolved model alias: ${alias}`);
    }

    return modelId;
  }
}
