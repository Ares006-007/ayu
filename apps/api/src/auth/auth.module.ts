import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import { MeController } from './me.controller.js';
import { JwtStrategy } from './strategies/jwt.strategy.js';
import { UsersModule } from '../users/users.module.js';
import { AuditModule } from '../audit/audit.module.js';
import { SessionService } from './services/session.service.js';
import { WorkspaceResolverService } from './services/workspace-resolver.service.js';
import { AuthContextService } from './services/auth-context.service.js';
import { PasswordResetService } from './services/password-reset.service.js';
import { ObjectAuthorizationService } from './authorization/object-authorization.service.js';
import { WorkspaceGuard } from './guards/workspace.guard.js';

@Module({
  imports: [
    UsersModule,
    AuditModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'super-secret-default-key-change-in-prod',
      signOptions: { expiresIn: '15m' },
    }),
  ],
  providers: [
    AuthService,
    JwtStrategy,
    SessionService,
    WorkspaceResolverService,
    AuthContextService,
    PasswordResetService,
    ObjectAuthorizationService,
    WorkspaceGuard,
  ],
  controllers: [AuthController, MeController],
  exports: [
    AuthService,
    AuthContextService,
    WorkspaceResolverService,
    ObjectAuthorizationService,
    WorkspaceGuard,
  ],
})
export class AuthModule {}
