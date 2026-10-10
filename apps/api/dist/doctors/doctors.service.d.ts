import { PrismaService } from '../database/database.module.js';
export declare class DoctorsService {
    private prisma;
    constructor(prisma: PrismaService);
    getTodaysAppointments(doctorId: string): Promise<({
        patient: {
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
            healthRecordNumber: string | null;
            dateOfBirth: Date;
            gender: string | null;
            primaryClinicId: string | null;
            timezone: string;
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
    })[]>;
    getConsultations(doctorId: string): Promise<({
        patient: {
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
            healthRecordNumber: string | null;
            dateOfBirth: Date;
            gender: string | null;
            primaryClinicId: string | null;
            timezone: string;
        };
    } & {
        id: string;
        status: string;
        patientId: string;
        doctorId: string;
        startedAt: Date;
        completedAt: Date | null;
        appointmentId: string;
        notes: string | null;
        diagnosis: string | null;
    })[]>;
    getPrescriptions(doctorId: string): Promise<({
        patient: {
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
            healthRecordNumber: string | null;
            dateOfBirth: Date;
            gender: string | null;
            primaryClinicId: string | null;
            timezone: string;
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
    })[]>;
    getPatients(doctorId: string): Promise<({
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
        healthRecordNumber: string | null;
        dateOfBirth: Date;
        gender: string | null;
        primaryClinicId: string | null;
        timezone: string;
    })[]>;
}
