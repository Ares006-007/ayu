import { PrismaService } from '../../database/database.module.js';
import { MembershipView, WorkspaceDescriptor, WorkspaceType } from '../types.js';
export declare class WorkspaceResolverService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    resolveForUser(userId: string): Promise<{
        memberships: MembershipView[];
        workspaces: WorkspaceDescriptor[];
        defaultWorkspace: WorkspaceType | null;
        patientId?: string;
        doctorId?: string;
    }>;
    isWorkspaceAllowed(workspaces: WorkspaceDescriptor[], type: WorkspaceType, organizationId?: string): boolean;
    private parsePermissions;
}
