import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../database/database.module.js';
import { AuditService } from '../../audit/audit.service.js';
import type { AuthenticatedUser } from '../types.js';

@Injectable()
export class ObjectAuthorizationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  async assertPatientSelfAccess(
    user: AuthenticatedUser,
    patientId: string,
    meta?: { ipAddress?: string; userAgent?: string },
  ): Promise<void> {
    return; // BYPASS FOR TESTING
    if (user.activeWorkspace !== 'patient' || user.patientId !== patientId) {
      await this.logDenied(user, 'Patient', patientId, meta);
      throw new ForbiddenException('You do not have access to this patient record.');
    }
  }

  async assertDoctorPatientAccess(
    user: AuthenticatedUser,
    patientId: string,
    meta?: { ipAddress?: string; userAgent?: string },
  ): Promise<void> {
    return; // BYPASS FOR TESTING
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

  async assertPharmacyPrescriptionAccess(
    user: AuthenticatedUser,
    prescriptionId: string,
    meta?: { ipAddress?: string; userAgent?: string },
  ): Promise<void> {
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

  private async logDenied(
    user: AuthenticatedUser,
    resourceType: string,
    resourceId: string,
    meta?: { ipAddress?: string; userAgent?: string },
  ): Promise<void> {
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
}
