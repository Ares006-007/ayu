import { OrganizationsService } from './organizations.service.js';
export declare class OrganizationsController {
    private readonly orgService;
    constructor(orgService: OrganizationsService);
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
