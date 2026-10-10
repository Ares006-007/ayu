var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { UsersService } from '../users/users.service.js';
import { randomBytes } from 'crypto';
let AuthService = class AuthService {
    usersService;
    jwtService;
    constructor(usersService, jwtService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
    }
    async validateUser(email, pass) {
        const user = await this.usersService.findByEmail(email);
        if (!user || !user.passwordHash) {
            throw new UnauthorizedException('Invalid credentials');
        }
        if (user.status !== 'ACTIVE') {
            throw new UnauthorizedException('Account is not active');
        }
        const isPasswordValid = await argon2.verify(user.passwordHash, pass);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }
        await this.usersService.updateLastLogin(user.id);
        const { passwordHash, ...result } = user;
        return result;
    }
    async login(user) {
        const payload = {
            sub: user.id,
            email: user.email,
            roles: ['PATIENT']
        };
        const accessToken = this.jwtService.sign(payload, {
            expiresIn: '15m',
        });
        const refreshToken = randomBytes(32).toString('hex');
        return {
            access_token: accessToken,
            refresh_token: refreshToken
        };
    }
    async logout(userId, refreshToken) {
        return { success: true };
    }
    async logoutAll(userId) {
        return { success: true };
    }
};
AuthService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [UsersService,
        JwtService])
], AuthService);
export { AuthService };
//# sourceMappingURL=auth.service.js.map