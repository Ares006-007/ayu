import { PrismaService } from '../../database/database.module.js';
export declare class SessionService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private hashToken;
    createSession(userId: string, meta?: {
        userAgent?: string;
        ipAddress?: string;
    }): Promise<{
        sessionId: string;
        refreshToken: string;
    }>;
    validateRefreshToken(refreshToken: string): Promise<{
        userId: string;
        sessionId: string;
    } | null>;
    rotateSession(sessionId: string, userId: string, meta?: {
        userAgent?: string;
        ipAddress?: string;
    }): Promise<{
        sessionId: string;
        refreshToken: string;
    }>;
    revokeSession(sessionId: string): Promise<void>;
    revokeByRefreshToken(refreshToken: string): Promise<void>;
    revokeAllForUser(userId: string): Promise<void>;
}
