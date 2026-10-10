import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { DatabaseModule } from './database/database.module.js';
import { AuthModule } from './auth/auth.module.js';
import { UsersModule } from './users/users.module.js';
import { OrganizationsModule } from './organizations/organizations.module.js';
import { AuditModule } from './audit/audit.module.js';
import { TelegramModule } from './telegram/telegram.module.js';
import { AiModule } from './ai/ai.module.js';

@Module({
  imports: [DatabaseModule, AuditModule, UsersModule, AuthModule, OrganizationsModule, TelegramModule, AiModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
