import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service.js';
export interface TokenPayload {
    sub: string;
    email: string;
    roles: string[];
}
export declare class AuthService {
    private usersService;
    private jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    validateUser(email: string, pass: string): Promise<any>;
    login(user: any): Promise<{
        access_token: string;
        refresh_token: string;
    }>;
    logout(userId: string, refreshToken: string): Promise<{
        success: boolean;
    }>;
    logoutAll(userId: string): Promise<{
        success: boolean;
    }>;
}
