import { AiOrchestratorService } from '../../orchestrator/ai-orchestrator.service.js';
export declare class LabReportPipelineService {
    private readonly orchestrator;
    private readonly logger;
    constructor(orchestrator: AiOrchestratorService);
    processLabReport(documentId: string, extractedText: string, organizationId: string, requestedBy: string, patientId?: string): Promise<{
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        patientId: string | null;
        organizationId: string;
        useCase: string;
        primaryModelAlias: string | null;
        secondaryModelAlias: string | null;
        reviewerModelAlias: string | null;
        requestedBy: string;
        documentId: string | null;
        promptVersion: string | null;
        schemaVersion: string | null;
        gatewayPolicyVersion: string | null;
        authorizationPurpose: string | null;
        consentReference: string | null;
        startedAt: Date | null;
        completedAt: Date | null;
        failureCategory: string | null;
        retryCount: number;
        requiresHumanReview: boolean;
    } | {
        status: string;
        method: string;
    }>;
}
