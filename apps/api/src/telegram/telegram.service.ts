import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Telegraf } from 'telegraf';
import { UsersService } from '../users/users.service.js';

@Injectable()
export class TelegramService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(TelegramService.name);
  public bot: Telegraf;

  constructor(private usersService: UsersService) {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    if (!token) {
      this.logger.warn('TELEGRAM_BOT_TOKEN is not set. Bot will not start.');
      return;
    }
    this.bot = new Telegraf(token);
    this.registerHandlers();
  }

  async onModuleInit() {
    if (!this.bot) return;

    const webhookUrl = process.env.TELEGRAM_WEBHOOK_URL;
    if (webhookUrl) {
      this.logger.log(`Starting Telegram Bot via Webhook at ${webhookUrl}`);
      // NestJS will handle the webhook via the TelegramController
      // We just need to tell Telegram where to send updates
      await this.bot.telegram.setWebhook(webhookUrl);
    } else {
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

  private registerHandlers() {
    this.bot.start((ctx) => {
      this.logger.log(`Received /start from ${ctx.from.id}`);
      
      const payload = ctx.message && 'text' in ctx.message ? ctx.message.text.split(' ')[1] : null;

      if (payload) {
        // Deep linking scenario: they clicked a specific link to start the bot
        // In a full implementation, you'd securely link the account here
        ctx.reply(`Welcome to AYU! We're processing your link code: ${payload}`);
      } else {
        // Standard start
        ctx.reply('Welcome to AYU! I am your personal health assistant. To link your account, please log in to the AYU patient portal and click "Connect to Telegram".');
      }
    });

    this.bot.help((ctx) => {
      ctx.reply('AYU Bot Help:\n- /start: Register or link account\n- /reminders: View upcoming meds');
    });

    this.bot.command('reminders', (ctx) => {
      // Connect to application services to fetch reminders
      ctx.reply('You have no pending reminders today. Stay healthy!');
    });
    
    // Catch-all
    this.bot.on('text', (ctx) => {
      ctx.reply("I'm sorry, I don't understand that command. Type /help for options.");
    });
  }
}
