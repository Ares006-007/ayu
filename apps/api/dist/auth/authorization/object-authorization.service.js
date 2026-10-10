var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../database/database.module.js';
import { AuditService } from '../../audit/audit.service.js';
let ObjectAuthorizationService = class ObjectAuthorizationService {
    prisma;
    auditService;
    constructor(prisma, auditService) {
        this.prisma = prisma;
        this.auditService = auditService;
    }
    async assertPatientSelfAccess(user, patientId, meta) {
        if (user.activeWorkspace !== 'patient' || user.patientId !== patientId) {
            await this.logDenied(user, 'Patient', patientId, meta);
            throw new ForbiddenException('You do not have access to this patient record.');
        }
    }
    async assertDoctorPatientAccess(user, patientId, meta) {
        if (user.activeWorkspace !== 'doctor' || !user.doctorId || !user.activeOrganizationId) {
            await this.logDenied(user, 'Patient', patientId, meta);
            throw new ForbiddenException('You do not have access to this patient record.');
        }
        const appointment = await this.prisma.appointment.findFirst({
            where: {
                patientId,
                doctorId: user.doctorId,
                organizationId: user.activeOrganizationId,
            },
            select: { id: true },
        });
        if (!appointment) {
            await this.logDenied(user, 'Patient', patientId, meta);
            throw new ForbiddenException('You do not have access to this patient record.');
        }
    }
    async assertPharmacyPrescriptionAccess(user, prescriptionId, meta) {
        if (user.activeWorkspace !== 'pharmacy' || !user.activeOrganizationId) {
            await this.logDenied(user, 'Prescription', prescriptionId, meta);
            throw new ForbiddenException('You do not have access to this prescription.');
        }
        const pharmacy = await this.prisma.pharmacy.findUnique({
            where: { organizationId: user.activeOrganizationId },
        });
        if (!pharmacy) {
            await this.logDenied(user, 'Prescription', prescriptionId, meta);
            throw new ForbiddenException('You do not have access to this prescription.');
        }
        const order = await this.prisma.pharmacyOrder.findFirst({
            where: { prescriptionId, pharmacyId: pharmacy.id },
            select: { id: true },
        });
        if (!order) {
            await this.logDenied(user, 'Prescription', prescriptionId, meta);
            throw new ForbiddenException('You do not have access to this prescription.');
        }
    }
    async logDenied(user, resourceType, resourceId, meta) {
        await this.auditService.logEvent({
            actorId: user.userId,
            organizationId: user.activeOrganizationId ?? undefined,
            action: 'ACCESS_DENIED',
            resourceType,
            resourceId,
            outcome: 'DENIED',
            ipAddress: meta?.ipAddress,
            userAgent: meta?.userAgent,
        });
    }
};
ObjectAuthorizationService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService,
        AuditService])
], ObjectAuthorizationService);
export { ObjectAuthorizationService };
//# sourceMappingURL=object-authorization.service.js.map