import { PrismaService } from '../../database/database.module.js';
import { AuditService } from '../../audit/audit.service.js';
import type { AuthenticatedUser } from '../types.js';
export declare class ObjectAuthorizationService {
    private readonly prisma;
    private readonly auditService;
    constructor(prisma: PrismaService, auditService: AuditService);
    assertPatientSelfAccess(user: AuthenticatedUser, patientId: string, meta?: {
        ipAddress?: string;
        userAgent?: string;
    }): Promise<void>;
    assertDoctorPatientAccess(user: AuthenticatedUser, patientId: string, meta?: {
        ipAddress?: string;
        userAgent?: string;
    }): Promise<void>;
    assertPharmacyPrescriptionAccess(user: AuthenticatedUser, prescriptionId: string, meta?: {
        ipAddress?: string;
        userAgent?: string;
    }): Promise<void>;
    private logDenied;
}
