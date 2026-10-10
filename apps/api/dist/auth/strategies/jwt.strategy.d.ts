import { Strategy } from 'passport-jwt';
import type { Request } from 'express';
import { AuthContextService } from '../services/auth-context.service.js';
import type { TokenPayload } from '../auth.service.js';
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly authContextService;
    constructor(authContextService: AuthContextService);
    validate(request: Request, payload: TokenPayload): Promise<import("../types.js").AuthenticatedUser>;
}
export {};
