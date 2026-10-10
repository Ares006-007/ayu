var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Controller, Post, Body, HttpCode, HttpStatus, Res, Req, UseGuards, } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { LoginDto } from './dto/login.dto.js';
import { ForgotPasswordDto } from './dto/forgot-password.dto.js';
import { ResetPasswordDto } from './dto/reset-password.dto.js';
import { SwitchWorkspaceDto } from './dto/switch-workspace.dto.js';
import { JwtAuthGuard } from './guards/jwt-auth.guard.js';
import { CurrentUser } from './decorators/current-user.decorator.js';
import { AuthContextService } from './services/auth-context.service.js';
import { WorkspaceResolverService } from './services/workspace-resolver.service.js';
import { setAuthCookies, clearAuthCookies, setWorkspaceCookie, } from './utils/cookie.util.js';
function requestMeta(request) {
    return {
        ipAddress: request.ip,
        userAgent: request.headers['user-agent'],
    };
}
let AuthController = class AuthController {
    authService;
    authContextService;
    workspaceResolver;
    constructor(authService, authContextService, workspaceResolver) {
        this.authService = authService;
        this.authContextService = authContextService;
        this.workspaceResolver = workspaceResolver;
    }
    async login(loginDto, response, request) {
        const user = await this.authService.validateUser(loginDto.email, loginDto.password, requestMeta(request));
        const tokens = await this.authService.login(user, requestMeta(request));
        setAuthCookies(response, tokens.access_token, tokens.refresh_token);
        const resolved = await this.workspaceResolver.resolveForUser(user.id);
        if (resolved.defaultWorkspace) {
            const ws = resolved.workspaces.find((w) => w.type === resolved.defaultWorkspace);
            setWorkspaceCookie(response, resolved.defaultWorkspace, ws?.organizationId);
        }
        const me = await this.authContextService.buildCurrentUserResponse(user.id, resolved.defaultWorkspace, resolved.workspaces.find((w) => w.type === resolved.defaultWorkspace)?.organizationId);
        return me;
    }
    async firebaseLogin(idToken, response, request) {
        const user = await this.authService.validateFirebaseUser(idToken, requestMeta(request));
        const tokens = await this.authService.login(user, requestMeta(request));
        setAuthCookies(response, tokens.access_token, tokens.refresh_token);
        const resolved = await this.workspaceResolver.resolveForUser(user.id);
        if (resolved.defaultWorkspace) {
            const ws = resolved.workspaces.find((w) => w.type === resolved.defaultWorkspace);
            setWorkspaceCookie(response, resolved.defaultWorkspace, ws?.organizationId);
        }
        return this.authContextService.buildCurrentUserResponse(user.id, resolved.defaultWorkspace, resolved.workspaces.find((w) => w.type === resolved.defaultWorkspace)?.organizationId);
    }
    async refresh(request, response) {
        const refreshToken = request.cookies?.refresh_token;
        if (!refreshToken) {
            clearAuthCookies(response);
            return { message: 'Session expired' };
        }
        const tokens = await this.authService.refreshSession(refreshToken, requestMeta(request));
        setAuthCookies(response, tokens.access_token, tokens.refresh_token);
        return { message: 'Session refreshed' };
    }
    async forgotPassword(dto, request) {
        await this.authService.requestPasswordReset(dto.email, requestMeta(request));
        return {
            message: 'If an account exists for that email, password reset instructions have been sent.',
        };
    }
    async resetPassword(dto, request) {
        await this.authService.resetPassword(dto.token, dto.password, requestMeta(request));
        return { message: 'Password has been reset. Sign in with your new password.' };
    }
    async switchWorkspace(dto, response, request, user) {
        await this.authService.switchWorkspace(user.userId, dto.workspace, dto.organizationId, requestMeta(request));
        setWorkspaceCookie(response, dto.workspace, dto.organizationId);
        return this.authContextService.buildCurrentUserResponse(user.userId, dto.workspace, dto.organizationId);
    }
    async logout(request, response, user) {
        const refreshToken = request.cookies?.refresh_token;
        if (refreshToken) {
            await this.authService.logout(user.userId, refreshToken, requestMeta(request));
        }
        clearAuthCookies(response);
        return { message: 'Signed out successfully.' };
    }
    async logoutAll(response, request, user) {
        await this.authService.logoutAll(user.userId, requestMeta(request));
        clearAuthCookies(response);
        return { message: 'Signed out from all sessions.' };
    }
};
__decorate([
    Post('login'),
    HttpCode(HttpStatus.OK),
    __param(0, Body()),
    __param(1, Res({ passthrough: true })),
    __param(2, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [LoginDto, Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    Post('firebase-login'),
    HttpCode(HttpStatus.OK),
    __param(0, Body('idToken')),
    __param(1, Res({ passthrough: true })),
    __param(2, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "firebaseLogin", null);
__decorate([
    Post('refresh'),
    HttpCode(HttpStatus.OK),
    __param(0, Req()),
    __param(1, Res({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refresh", null);
__decorate([
    Post('forgot-password'),
    HttpCode(HttpStatus.OK),
    __param(0, Body()),
    __param(1, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ForgotPasswordDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "forgotPassword", null);
__decorate([
    Post('reset-password'),
    HttpCode(HttpStatus.OK),
    __param(0, Body()),
    __param(1, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ResetPasswordDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resetPassword", null);
__decorate([
    UseGuards(JwtAuthGuard),
    Post('workspace'),
    HttpCode(HttpStatus.OK),
    __param(0, Body()),
    __param(1, Res({ passthrough: true })),
    __param(2, Req()),
    __param(3, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SwitchWorkspaceDto, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "switchWorkspace", null);
__decorate([
    UseGuards(JwtAuthGuard),
    Post('logout'),
    HttpCode(HttpStatus.OK),
    __param(0, Req()),
    __param(1, Res({ passthrough: true })),
    __param(2, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
__decorate([
    UseGuards(JwtAuthGuard),
    Post('logout-all'),
    HttpCode(HttpStatus.OK),
    __param(0, Res({ passthrough: true })),
    __param(1, Req()),
    __param(2, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logoutAll", null);
AuthController = __decorate([
    Controller('v1/auth'),
    __metadata("design:paramtypes", [AuthService,
        AuthContextService,
        WorkspaceResolverService])
], AuthController);
export { AuthController };
//# sourceMappingURL=auth.controller.js.map