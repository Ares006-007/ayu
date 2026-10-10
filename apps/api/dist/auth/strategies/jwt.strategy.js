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
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthContextService } from '../services/auth-context.service.js';
import { parseWorkspaceCookie } from '../utils/cookie.util.js';
let JwtStrategy = class JwtStrategy extends PassportStrategy(Strategy) {
    authContextService;
    constructor(authContextService) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (request) => {
                    if (request?.cookies?.access_token) {
                        return request.cookies.access_token;
                    }
                    if (request.headers.authorization?.startsWith('Bearer ')) {
                        return request.headers.authorization.split(' ')[1];
                    }
                    return null;
                },
            ]),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET || 'super-secret-default-key-change-in-prod',
            passReqToCallback: true,
        });
        this.authContextService = authContextService;
    }
    async validate(request, payload) {
        if (!payload.sub) {
            throw new UnauthorizedException('Invalid session');
        }
        const workspaceCookie = parseWorkspaceCookie(request.cookies?.ayu_workspace);
        const user = await this.authContextService.buildAuthenticatedUser(payload.sub, workspaceCookie?.workspace, workspaceCookie?.organizationId);
        if (!user) {
            throw new UnauthorizedException('Account is not active');
        }
        return user;
    }
};
JwtStrategy = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [AuthContextService])
], JwtStrategy);
export { JwtStrategy };
//# sourceMappingURL=jwt.strategy.js.map