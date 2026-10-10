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
}
