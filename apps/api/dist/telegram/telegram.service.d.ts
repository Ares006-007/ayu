import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Telegraf } from 'telegraf';
import { UsersService } from '../users/users.service.js';
export declare class TelegramService implements OnModuleInit, OnModuleDestroy {
    private usersService;
    private readonly logger;
    bot: Telegraf;
    constructor(usersService: UsersService);
    onModuleInit(): Promise<void>;
    onModuleDestroy(): void;
    private registerHandlers;
}
