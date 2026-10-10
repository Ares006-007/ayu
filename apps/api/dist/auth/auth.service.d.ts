import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service.js';
import { SessionService } from './services/session.service.js';
import { AuthContextService } from './services/auth-context.service.js';
import { PasswordResetService } from './services/password-reset.service.js';
import { WorkspaceResolverService } from './services/workspace-resolver.service.js';
import { AuditService } from '../audit/audit.service.js';
import type { WorkspaceType } from './types.js';
export interface TokenPayload {
    sub: string;
}
export interface RequestMeta {
    ipAddress?: string;
    userAgent?: string;
}
export declare class AuthService {
    private usersService;
    private jwtService;
    private sessionService;
    private authContextService;
    private passwordResetService;
    private workspaceResolver;
    private auditService;
    private readonly logger;
    constructor(usersService: UsersService, jwtService: JwtService, sessionService: SessionService, authContextService: AuthContextService, passwordResetService: PasswordResetService, workspaceResolver: WorkspaceResolverService, auditService: AuditService);
    validateUser(email: string, pass: string, meta?: RequestMeta): Promise<{
        id: string;
        email: string;
        name: string | null;
    }>;
    login(user: {
        id: string;
        email: string;
    }, meta?: RequestMeta): Promise<{
        access_token: string;
        refresh_token: string;
        sessionId: string;
    }>;
    refreshSession(refreshToken: string, meta?: RequestMeta): Promise<{
        access_token: string;
        refresh_token: string;
    }>;
    logout(userId: string, refreshToken: string, meta?: RequestMeta): Promise<void>;
    logoutAll(userId: string, meta?: RequestMeta): Promise<void>;
    requestPasswordReset(email: string, meta?: RequestMeta): Promise<void>;
    resetPassword(token: string, password: string, meta?: RequestMeta): Promise<void>;
    switchWorkspace(userId: string, workspace: WorkspaceType, organizationId?: string, meta?: RequestMeta): Promise<void>;
    validateFirebaseUser(idToken: string, meta?: RequestMeta): Promise<{
        id: string;
        email: string;
        name: string | null;
    }>;
}
