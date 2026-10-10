import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import type { Request } from 'express';
import { AuthContextService } from '../services/auth-context.service.js';
import { parseWorkspaceCookie } from '../utils/cookie.util.js';
import type { TokenPayload } from '../auth.service.js';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authContextService: AuthContextService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
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
  }

  async validate(request: Request, payload: TokenPayload) {
    if (!payload.sub) {
      throw new UnauthorizedException('Invalid session');
    }

    const workspaceCookie = parseWorkspaceCookie(request.cookies?.ayu_workspace);
    const user = await this.authContextService.buildAuthenticatedUser(
      payload.sub,
      workspaceCookie?.workspace,
      workspaceCookie?.organizationId,
    );

    if (!user) {
      throw new UnauthorizedException('Account is not active');
    }

    return user;
  }
}
