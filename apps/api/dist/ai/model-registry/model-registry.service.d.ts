import { AiConfigService } from '../ai-config.service.js';
import { PrismaService } from '../../database/database.module.js';
export declare class ModelRegistryService {
    private readonly aiConfigService;
    private readonly prisma;
    private readonly logger;
    constructor(aiConfigService: AiConfigService, prisma: PrismaService);
    resolveModelId(alias: string): Promise<string>;
}
