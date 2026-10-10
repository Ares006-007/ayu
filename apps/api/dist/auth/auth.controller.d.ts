import { AuthService } from './auth.service.js';
import { LoginDto } from './dto/login.dto.js';
import type { Response, Request } from 'express';
import { UsersService } from '../users/users.service.js';
export declare class AuthController {
    private readonly authService;
    private readonly usersService;
    constructor(authService: AuthService, usersService: UsersService);
    login(loginDto: LoginDto, response: Response): Promise<{
        message: string;
        user: {
            id: any;
            email: any;
            roles: string[];
        };
    }>;
    logout(request: Request, response: Response, user: any): Promise<{
        message: string;
    }>;
    logoutAll(response: Response, user: any): Promise<{
        message: string;
    }>;
    getCurrentUser(user: any): Promise<{
        id: string;
        email: string;
        phone: string | null;
        externalAuthId: string | null;
        status: string;
        lastLoginAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
}
