import { Module } from '@nestjs/common';
import { TelegramService } from './telegram.service.js';
import { TelegramController } from './telegram.controller.js';
import { UsersModule } from '../users/users.module.js';
import { AiModule } from '../ai/ai.module.js';

@Module({
  imports: [UsersModule, AiModule],
  providers: [TelegramService],
  controllers: [TelegramController],
  exports: [TelegramService],
})
export class TelegramModule {}
