import { PrismaService } from '../database/database.module.js';
export declare class OrganizationsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        id: string;
        name: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        timezone: string;
        type: string;
    }[]>;
    findByIds(ids: string[]): Promise<{
        id: string;
        name: string;
        status: string;
        timezone: string;
        type: string;
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
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            organizationId: string;
            role: string;
            permissions: string;
        })[];
    } & {
        id: string;
        name: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        timezone: string;
        type: string;
    }>;
}
