import type { Request } from 'express';
import { OrganizationsService } from './organizations.service.js';
import { AuditService } from '../audit/audit.service.js';
import type { AuthenticatedUser } from '../auth/types.js';
export declare class OrganizationsController {
    private readonly orgService;
    private readonly auditService;
    constructor(orgService: OrganizationsService, auditService: AuditService);
    findAll(user: AuthenticatedUser): Promise<{
        id: string;
        name: string;
        status: string;
        timezone: string;
        type: string;
    }[]>;
    findOne(id: string, user: AuthenticatedUser, request: Request): Promise<{
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
