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
import { Controller, Post, Body, HttpCode, HttpStatus, Res, Req, UseGuards, Get } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { LoginDto } from './dto/login.dto.js';
import { JwtAuthGuard } from './guards/jwt-auth.guard.js';
import { CurrentUser } from './decorators/current-user.decorator.js';
import { UsersService } from '../users/users.service.js';
let AuthController = class AuthController {
    authService;
    usersService;
    constructor(authService, usersService) {
        this.authService = authService;
        this.usersService = usersService;
    }
    async login(loginDto, response) {
        const user = await this.authService.validateUser(loginDto.email, loginDto.password);
        const tokens = await this.authService.login(user);
        response.cookie('access_token', tokens.access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000,
        });
        response.cookie('refresh_token', tokens.refresh_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/v1/auth/refresh',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        return {
            message: 'Logged in successfully',
            user: {
                id: user.id,
                email: user.email,
                roles: ['PATIENT']
            }
        };
    }
    async logout(request, response, user) {
        const refreshToken = request.cookies['refresh_token'];
        if (refreshToken) {
            await this.authService.logout(user.userId, refreshToken);
        }
        response.clearCookie('access_token');
        response.clearCookie('refresh_token', { path: '/v1/auth/refresh' });
        return { message: 'Logged out successfully' };
    }
    async logoutAll(response, user) {
        await this.authService.logoutAll(user.userId);
        response.clearCookie('access_token');
        response.clearCookie('refresh_token', { path: '/v1/auth/refresh' });
        return { message: 'Logged out from all sessions' };
    }
    async getCurrentUser(user) {
        const userData = await this.usersService.findById(user.userId);
        if (!userData) {
            return null;
        }
        const { passwordHash, ...safeUserData } = userData;
        return safeUserData;
    }
};
__decorate([
    Post('login'),
    HttpCode(HttpStatus.OK),
    __param(0, Body()),
    __param(1, Res({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [LoginDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
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
    __param(1, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logoutAll", null);
__decorate([
    UseGuards(JwtAuthGuard),
    Get('me'),
    __param(0, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getCurrentUser", null);
AuthController = __decorate([
    Controller('v1/auth'),
    __metadata("design:paramtypes", [AuthService,
        UsersService])
], AuthController);
export { AuthController };
//# sourceMappingURL=auth.controller.js.map