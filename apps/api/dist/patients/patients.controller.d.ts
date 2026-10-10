import type { Request } from 'express';
import { ObjectAuthorizationService } from '../auth/authorization/object-authorization.service.js';
import { PatientsService } from './patients.service.js';
import type { AuthenticatedUser } from '../auth/types.js';
export declare class PatientsController {
    private readonly patientsService;
    private readonly objectAuth;
    constructor(patientsService: PatientsService, objectAuth: ObjectAuthorizationService);
    getMyProfile(user: AuthenticatedUser): Promise<{
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
    getPatient(id: string, user: AuthenticatedUser, request: Request): Promise<{
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
    getPatientDashboard(id: string, user: AuthenticatedUser, request: Request): Promise<{
        appointments: ({
            doctor: {
                user: {
                    id: string;
                    status: string;
                    email: string;
                    name: string | null;
                    phone: string | null;
                    passwordHash: string | null;
                    externalAuthId: string | null;
                    failedLoginAttempts: number;
                    lockedUntil: Date | null;
                    emailVerifiedAt: Date | null;
                    lastLoginAt: Date | null;
                    createdAt: Date;
                    updatedAt: Date;
                };
            } & {
                id: string;
                userId: string;
                status: string;
                registrationNumber: string;
                specialty: string | null;
                clinicId: string | null;
            };
            organization: {
                id: string;
                timezone: string;
                status: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                type: string;
            };
        } & {
            id: string;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            patientId: string;
            doctorId: string;
            organizationId: string;
            startsAt: Date;
            endsAt: Date;
            reason: string | null;
            reminderPolicy: string | null;
        })[];
        activePrescriptions: ({
            doctor: {
                user: {
                    id: string;
                    status: string;
                    email: string;
                    name: string | null;
                    phone: string | null;
                    passwordHash: string | null;
                    externalAuthId: string | null;
                    failedLoginAttempts: number;
                    lockedUntil: Date | null;
                    emailVerifiedAt: Date | null;
                    lastLoginAt: Date | null;
                    createdAt: Date;
                    updatedAt: Date;
                };
            } & {
                id: string;
                userId: string;
                status: string;
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
            patientId: string;
            doctorId: string;
            organizationId: string;
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
    bookAppointment(id: string, payload: {
        doctorId: string;
        date: string;
        timeSlot: string;
        symptoms: string;
    }, user: AuthenticatedUser, request: Request): Promise<{
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        patientId: string;
        doctorId: string;
        organizationId: string;
        startsAt: Date;
        endsAt: Date;
        reason: string | null;
        reminderPolicy: string | null;
    }>;
}
