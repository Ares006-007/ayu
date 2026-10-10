import { PrismaService } from '../database/database.module.js';
export declare class OrganizationsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        type: string;
        timezone: string;
    }[]>;
    findOne(id: string): Promise<{
        memberships: ({
            user: {
                id: string;
                email: string;
            };
        } & {
            id: string;
            status: string;
            organizationId: string;
            userId: string;
            role: string;
            permissions: string;
        })[];
    } & {
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        type: string;
        timezone: string;
    }>;
}
