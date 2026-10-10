import { DoctorsService } from './doctors.service.js';
export declare class DoctorsController {
    private readonly doctorsService;
    constructor(doctorsService: DoctorsService);
    getTodaysAppointments(id: string): Promise<({
        patient: {
            user: {
                id: string;
                status: string;
                createdAt: Date;
                updatedAt: Date;
                name: string | null;
                email: string;
                phone: string | null;
                passwordHash: string | null;
                externalAuthId: string | null;
                failedLoginAttempts: number;
                lockedUntil: Date | null;
                emailVerifiedAt: Date | null;
                lastLoginAt: Date | null;
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
        patientId: string;
        doctorId: string;
        organizationId: string;
        startsAt: Date;
        endsAt: Date;
        reason: string | null;
        status: string;
        reminderPolicy: string | null;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    getConsultations(id: string): Promise<({
        patient: {
            user: {
                id: string;
                status: string;
                createdAt: Date;
                updatedAt: Date;
                name: string | null;
                email: string;
                phone: string | null;
                passwordHash: string | null;
                externalAuthId: string | null;
                failedLoginAttempts: number;
                lockedUntil: Date | null;
                emailVerifiedAt: Date | null;
                lastLoginAt: Date | null;
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
        patientId: string;
        doctorId: string;
        status: string;
        appointmentId: string;
        notes: string | null;
        diagnosis: string | null;
        startedAt: Date;
        completedAt: Date | null;
    })[]>;
    getPrescriptions(id: string): Promise<({
        patient: {
            user: {
                id: string;
                status: string;
                createdAt: Date;
                updatedAt: Date;
                name: string | null;
                email: string;
                phone: string | null;
                passwordHash: string | null;
                externalAuthId: string | null;
                failedLoginAttempts: number;
                lockedUntil: Date | null;
                emailVerifiedAt: Date | null;
                lastLoginAt: Date | null;
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
        patientId: string;
        doctorId: string;
        organizationId: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        consultationId: string | null;
        verifiedBy: string | null;
        verifiedAt: Date | null;
        sentAt: Date | null;
        version: number;
        cancelledAt: Date | null;
    })[]>;
    getPatients(id: string): Promise<({
        user: {
            id: string;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            name: string | null;
            email: string;
            phone: string | null;
            passwordHash: string | null;
            externalAuthId: string | null;
            failedLoginAttempts: number;
            lockedUntil: Date | null;
            emailVerifiedAt: Date | null;
            lastLoginAt: Date | null;
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
