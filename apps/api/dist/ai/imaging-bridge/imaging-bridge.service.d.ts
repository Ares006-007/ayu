import { ConfigService } from '@nestjs/config';
import { AiOrchestratorService } from '../orchestrator/ai-orchestrator.service.js';
export declare class ImagingBridgeService {
    private readonly configService;
    private readonly orchestrator;
    private readonly logger;
    private readonly baseUrl;
    constructor(configService: ConfigService, orchestrator: AiOrchestratorService);
    requestImagingConversion(studyId: string, filePath: string): Promise<{
        status: string;
        canonicalPath: string;
    }>;
    generateImagingDraft(studyId: string, canonicalPath: string, organizationId: string, requestedBy: string, patientId?: string): Promise<{
        status: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        patientId: string | null;
        organizationId: string;
        useCase: string;
        requestedBy: string;
        documentId: string | null;
        primaryModelAlias: string | null;
        secondaryModelAlias: string | null;
        reviewerModelAlias: string | null;
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
