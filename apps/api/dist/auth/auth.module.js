var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
let AuthModule = class AuthModule {
};
AuthModule = __decorate([
    Module({
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
], AuthModule);
export { AuthModule };
//# sourceMappingURL=auth.module.js.map