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
    getPatientDashboard(patientId: string): Promise<{
        appointments: ({
            organization: {
                id: string;
                name: string;
                status: string;
                createdAt: Date;
                updatedAt: Date;
                timezone: string;
                type: string;
            };
            doctor: {
                user: {
                    id: string;
                    email: string;
                    name: string | null;
                    phone: string | null;
                    passwordHash: string | null;
                    externalAuthId: string | null;
                    status: string;
                    failedLoginAttempts: number;
                    lockedUntil: Date | null;
                    emailVerifiedAt: Date | null;
                    lastLoginAt: Date | null;
                    createdAt: Date;
                    updatedAt: Date;
                };
            } & {
                id: string;
                status: string;
                userId: string;
                registrationNumber: string;
                specialty: string | null;
                clinicId: string | null;
            };
        } & {
            id: string;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            organizationId: string;
            patientId: string;
            doctorId: string;
            startsAt: Date;
            endsAt: Date;
            reason: string | null;
            reminderPolicy: string | null;
        })[];
        activePrescriptions: ({
            doctor: {
                user: {
                    id: string;
                    email: string;
                    name: string | null;
                    phone: string | null;
                    passwordHash: string | null;
                    externalAuthId: string | null;
                    status: string;
                    failedLoginAttempts: number;
                    lockedUntil: Date | null;
                    emailVerifiedAt: Date | null;
                    lastLoginAt: Date | null;
                    createdAt: Date;
                    updatedAt: Date;
                };
            } & {
                id: string;
                status: string;
                userId: string;
                registrationNumber: string;
                specialty: string | null;
                clinicId: string | null;
            };
            items: {
                id: string;
                status: string;
                prescriptionId: string;
                medicineId: string;
                medicineNameSnapshot: string;
                strength: string | null;
                dosageForm: string | null;
                dose: string;
                frequency: string;
                scheduleDefinition: string;
                foodInstruction: string | null;
                startDate: Date | null;
                endDate: Date | null;
                durationDays: number | null;
                additionalInstructions: string | null;
            }[];
        } & {
            id: string;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            organizationId: string;
            patientId: string;
            doctorId: string;
            consultationId: string | null;
            verifiedBy: string | null;
            verifiedAt: Date | null;
            sentAt: Date | null;
            version: number;
            cancelledAt: Date | null;
        })[];
        doseEvents: {
            id: string;
            status: string;
            medicineName: string;
            scheduledTime: string;
        }[];
        recentReports: {
            id: string;
            status: string;
            createdAt: Date;
            patientId: string | null;
            ownerType: string;
            ownerId: string;
            category: string;
            storageKey: string;
            originalFilename: string;
            mimeType: string;
            size: number;
            checksum: string;
            uploadedBy: string;
        }[];
    }>;
    createAppointment(patientId: string, payload: {
        doctorId: string;
        date: string;
        timeSlot: string;
        symptoms: string;
    }): Promise<{
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
        patientId: string;
        doctorId: string;
        startsAt: Date;
        endsAt: Date;
        reason: string | null;
        reminderPolicy: string | null;
    }>;
}
