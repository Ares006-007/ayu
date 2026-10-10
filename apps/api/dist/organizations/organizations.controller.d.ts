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
        type: string;
        name: string;
        status: string;
        timezone: string;
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
            organizationId: string;
            userId: string;
            role: string;
            permissions: string;
        })[];
    } & {
        id: string;
        type: string;
        name: string;
        status: string;
        timezone: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
