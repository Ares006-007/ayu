import type { Response, Request } from 'express';
import { AuthService } from './auth.service.js';
import { LoginDto } from './dto/login.dto.js';
import { ForgotPasswordDto } from './dto/forgot-password.dto.js';
import { ResetPasswordDto } from './dto/reset-password.dto.js';
import { SwitchWorkspaceDto } from './dto/switch-workspace.dto.js';
import { AuthContextService } from './services/auth-context.service.js';
import { WorkspaceResolverService } from './services/workspace-resolver.service.js';
import type { AuthenticatedUser } from './types.js';
export declare class AuthController {
    private readonly authService;
    private readonly authContextService;
    private readonly workspaceResolver;
    constructor(authService: AuthService, authContextService: AuthContextService, workspaceResolver: WorkspaceResolverService);
    login(loginDto: LoginDto, response: Response, request: Request): Promise<import("./types.js").CurrentUserResponse | null>;
    firebaseLogin(idToken: string, response: Response, request: Request): Promise<import("./types.js").CurrentUserResponse | null>;
    refresh(request: Request, response: Response): Promise<{
        message: string;
    }>;
    forgotPassword(dto: ForgotPasswordDto, request: Request): Promise<{
        message: string;
    }>;
    resetPassword(dto: ResetPasswordDto, request: Request): Promise<{
        message: string;
    }>;
    switchWorkspace(dto: SwitchWorkspaceDto, response: Response, request: Request, user: AuthenticatedUser): Promise<import("./types.js").CurrentUserResponse | null>;
    logout(request: Request, response: Response, user: AuthenticatedUser): Promise<{
        message: string;
    }>;
    logoutAll(response: Response, request: Request, user: AuthenticatedUser): Promise<{
        message: string;
    }>;
}
