import { PrismaService } from '../../database/database.module.js';
export declare class AiReviewService {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    createReviewTask(jobId: string, reviewType: string, assignedRole: string): Promise<{
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        reviewType: string;
        assignedRole: string;
        assignedUserId: string | null;
        conflictFields: string | null;
        resolution: string | null;
        resolvedBy: string | null;
        resolvedAt: Date | null;
        jobId: string;
    }>;
    resolveReviewTask(taskId: string, userId: string, resolution: any): Promise<{
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        reviewType: string;
        assignedRole: string;
        assignedUserId: string | null;
        conflictFields: string | null;
        resolution: string | null;
        resolvedBy: string | null;
        resolvedAt: Date | null;
        jobId: string;
    }>;
    getPendingTasksForRole(role: string): Promise<({
        job: {
            id: string;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            organizationId: string;
            patientId: string | null;
            documentId: string | null;
            useCase: string;
            primaryModelAlias: string | null;
            secondaryModelAlias: string | null;
            reviewerModelAlias: string | null;
            requiresHumanReview: boolean;
            requestedBy: string;
            promptVersion: string | null;
            schemaVersion: string | null;
            gatewayPolicyVersion: string | null;
            authorizationPurpose: string | null;
            consentReference: string | null;
            startedAt: Date | null;
            completedAt: Date | null;
            failureCategory: string | null;
            retryCount: number;
        };
    } & {
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        reviewType: string;
        assignedRole: string;
        assignedUserId: string | null;
        conflictFields: string | null;
        resolution: string | null;
        resolvedBy: string | null;
        resolvedAt: Date | null;
        jobId: string;
    })[]>;
}
