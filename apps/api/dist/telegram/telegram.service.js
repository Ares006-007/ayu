var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var TelegramService_1;
import { Injectable, Logger } from '@nestjs/common';
import { Telegraf } from 'telegraf';
import { UsersService } from '../users/users.service.js';
import { AiGatewayService } from '../ai/ai-gateway/ai-gateway.service.js';
import { ModelRegistryService } from '../ai/model-registry/model-registry.service.js';
let TelegramService = TelegramService_1 = class TelegramService {
    usersService;
    aiGatewayService;
    modelRegistryService;
    logger = new Logger(TelegramService_1.name);
    bot;
    constructor(usersService, aiGatewayService, modelRegistryService) {
        this.usersService = usersService;
        this.aiGatewayService = aiGatewayService;
        this.modelRegistryService = modelRegistryService;
        const token = process.env.TELEGRAM_BOT_TOKEN;
        if (!token) {
            this.logger.warn('TELEGRAM_BOT_TOKEN is not set. Bot will not start.');
            return;
        }
        this.bot = new Telegraf(token);
        this.registerHandlers();
    }
    async onModuleInit() {
        if (!this.bot)
            return;
        const webhookUrl = process.env.TELEGRAM_WEBHOOK_URL;
        if (webhookUrl) {
            this.logger.log(`Starting Telegram Bot via Webhook at ${webhookUrl}`);
            await this.bot.telegram.setWebhook(webhookUrl);
        }
        else {
            this.logger.log('Starting Telegram Bot via Long Polling');
            await this.bot.telegram.deleteWebhook();
            this.bot.launch();
        }
    }
    onModuleDestroy() {
        if (this.bot && !process.env.TELEGRAM_WEBHOOK_URL) {
            this.bot.stop('SIGINT');
        }
    }
    registerHandlers() {
        this.bot.start((ctx) => {
            this.logger.log(`Received /start from ${ctx.from.id}`);
            const payload = ctx.message && 'text' in ctx.message ? ctx.message.text.split(' ')[1] : null;
            if (payload) {
                ctx.reply(`Welcome to AYU! We're processing your link code: ${payload}`);
            }
            else {
                ctx.reply('Welcome to AYU! I am your personal health assistant. To link your account, please log in to the AYU patient portal and click "Connect to Telegram".');
            }
        });
        this.bot.help((ctx) => {
            ctx.reply('AYU Bot Help:\n- /start: Register or link account\n- /reminders: View upcoming meds');
        });
        this.bot.command('reminders', (ctx) => {
            ctx.reply('You have no pending reminders today. Stay healthy!');
        });
        this.bot.on('text', async (ctx) => {
            if (!ctx.message || !('text' in ctx.message))
                return;
            try {
                await ctx.sendChatAction('typing');
                const modelId = await this.modelRegistryService.resolveModelId('general-text-fallback');
                const response = await this.aiGatewayService.generateText({
                    model: modelId,
                    systemPrompt: 'You are AYUSH, a helpful healthcare assistant for the AYU platform. Be concise, polite, and helpful. Do not provide medical diagnoses.',
                    userPrompt: ctx.message.text,
                    maxTokens: 500,
                    temperature: 0.7
                });
                await ctx.reply(response.text);
            }
            catch (error) {
                this.logger.error(`Error processing telegram text with AI: ${error.message}`);
                await ctx.reply("I'm sorry, I'm having trouble processing that request right now.");
            }
        });
    }
};
TelegramService = TelegramService_1 = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [UsersService,
        AiGatewayService,
        ModelRegistryService])
], TelegramService);
export { TelegramService };
//# sourceMappingURL=telegram.service.js.map