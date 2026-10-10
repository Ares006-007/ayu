import { AiOrchestratorService } from '../../orchestrator/ai-orchestrator.service.js';
export declare class DocumentPipelineService {
    private readonly orchestrator;
    private readonly logger;
    constructor(orchestrator: AiOrchestratorService);
    processDocument(documentId: string, fileBuffer: Buffer, mimeType: string, organizationId: string, requestedBy: string, patientId?: string): Promise<{
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
        patientId: string | null;
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
    }>;
}
