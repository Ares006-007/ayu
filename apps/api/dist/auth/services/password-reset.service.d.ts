import { PrismaService } from '../../database/database.module.js';
export declare class PasswordResetService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private hashToken;
    createResetToken(userId: string): Promise<string>;
    resetPassword(token: string, newPassword: string): Promise<string>;
}
