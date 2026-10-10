import type { Request } from 'express';
import { AuthContextService } from './services/auth-context.service.js';
import type { AuthenticatedUser } from './types.js';
export declare class MeController {
    private readonly authContextService;
    constructor(authContextService: AuthContextService);
    getCurrentUser(user: AuthenticatedUser, request: Request): Promise<import("./types.js").CurrentUserResponse | null>;
}
