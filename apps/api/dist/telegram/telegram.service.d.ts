import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Telegraf } from 'telegraf';
import { UsersService } from '../users/users.service.js';
import { AiGatewayService } from '../ai/ai-gateway/ai-gateway.service.js';
import { ModelRegistryService } from '../ai/model-registry/model-registry.service.js';
export declare class TelegramService implements OnModuleInit, OnModuleDestroy {
    private usersService;
    private aiGatewayService;
    private modelRegistryService;
    private readonly logger;
    bot: Telegraf;
    constructor(usersService: UsersService, aiGatewayService: AiGatewayService, modelRegistryService: ModelRegistryService);
    onModuleInit(): Promise<void>;
    onModuleDestroy(): void;
    private registerHandlers;
}
