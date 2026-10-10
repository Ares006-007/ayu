import { Controller, Post, Req, Res, HttpStatus } from '@nestjs/common';
import { TelegramService } from './telegram.service.js';
import type { Request, Response } from 'express';

@Controller('webhooks/telegram')
export class TelegramController {
  constructor(private readonly telegramService: TelegramService) {}

  @Post()
  async handleWebhook(@Req() req: Request, @Res() res: Response) {
    if (!this.telegramService.bot) {
      return res.status(HttpStatus.SERVICE_UNAVAILABLE).send('Bot not configured');
    }

    try {
      // Pass the request body to telegraf for processing
      await this.telegramService.bot.handleUpdate(req.body);
      return res.status(HttpStatus.OK).send('OK');
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send('Error processing update');
    }
  }
}
