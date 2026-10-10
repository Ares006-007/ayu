import { PrismaService } from '../database/database.module.js';
export declare class PatientsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getPatientProfile(patientId: string): Promise<{
        id: string;
        userId: string;
        email: string;
        name: string | null;
        phone: string | null;
        dateOfBirth: Date;
        gender: string | null;
        healthRecordNumber: string | null;
        status: string;
    }>;
}
