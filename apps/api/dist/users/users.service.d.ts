import { PrismaService } from '../database/database.module.js';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    findByEmail(email: string): Promise<{
        id: string;
        email: string;
        phone: string | null;
        passwordHash: string | null;
        externalAuthId: string | null;
        status: string;
        lastLoginAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    findById(id: string): Promise<{
        id: string;
        email: string;
        phone: string | null;
        passwordHash: string | null;
        externalAuthId: string | null;
        status: string;
        lastLoginAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    updateLastLogin(id: string): Promise<{
        id: string;
        email: string;
        phone: string | null;
        passwordHash: string | null;
        externalAuthId: string | null;
        status: string;
        lastLoginAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
