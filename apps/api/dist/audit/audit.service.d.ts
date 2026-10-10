import { PrismaService } from '../database/database.module.js';
export interface AuditEvent {
    actorId: string;
    organizationId?: string;
    action: string;
    resourceType: string;
    resourceId: string;
    outcome: 'SUCCESS' | 'FAILURE' | 'DENIED';
    requestId?: string;
    ipAddress?: string;
    userAgent?: string;
    metadata?: any;
}
export declare class AuditService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    logEvent(event: AuditEvent): Promise<{
        id: string;
        createdAt: Date;
        organizationId: string | null;
        actorId: string;
        action: string;
        resourceType: string;
        resourceId: string;
        outcome: string;
        requestId: string | null;
        ipAddress: string | null;
        userAgent: string | null;
        metadata: string | null;
    } | undefined>;
}
