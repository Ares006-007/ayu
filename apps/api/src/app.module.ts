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
import { PatientsModule } from './patients/patients.module.js';

import { ConfigModule } from '@nestjs/config';
import { DoctorsModule } from './doctors/doctors.module.js';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), DatabaseModule, AuditModule, UsersModule, AuthModule, OrganizationsModule, PatientsModule, TelegramModule, AiModule, DoctorsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
