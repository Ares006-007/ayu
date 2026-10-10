import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/database.module.js';
import {
  MembershipView,
  WorkspaceDescriptor,
  WorkspaceType,
} from '../types.js';

@Injectable()
export class WorkspaceResolverService {
  constructor(private readonly prisma: PrismaService) {}

  async resolveForUser(userId: string): Promise<{
    memberships: MembershipView[];
    workspaces: WorkspaceDescriptor[];
    defaultWorkspace: WorkspaceType | null;
    patientId?: string;
    doctorId?: string;
  }> {
    const [user, memberships] = await Promise.all([
      this.prisma.user.findUnique({
        where: { id: userId },
        include: { patientRecord: true, doctorRecord: true },
      }),
      this.prisma.organizationMembership.findMany({
        where: { userId, status: 'ACTIVE' },
        include: { organization: true },
      }),
    ]);

    if (!user) {
      return { memberships: [], workspaces: [], defaultWorkspace: null };
    }

    const membershipViews: MembershipView[] = memberships.map((m) => ({
      organizationId: m.organizationId,
      organizationName: m.organization.name,
      organizationType: m.organization.type.toLowerCase(),
      role: m.role.toLowerCase(),
      permissions: this.parsePermissions(m.permissions),
      status: m.status.toLowerCase(),
    }));

    const workspaces: WorkspaceDescriptor[] = [];
    const seen = new Set<string>();

    if (user.patientRecord && user.patientRecord.status === 'ACTIVE') {
      workspaces.push({
        type: 'patient',
        label: 'Patient',
      });
      seen.add('patient');
    }

    for (const m of memberships) {
      const org = m.organization;
      if (m.status !== 'ACTIVE') continue;

      if (org.type === 'CLINIC' && m.role === 'DOCTOR' && user.doctorRecord) {
        const key = `doctor:${org.id}`;
        if (!seen.has(key)) {
          workspaces.push({
            type: 'doctor',
            organizationId: org.id,
            organizationName: org.name,
            label: `Doctor — ${org.name}`,
          });
          seen.add(key);
        }
      }

      if (org.type === 'CLINIC' && m.role === 'ADMIN') {
        const key = `clinic_admin:${org.id}`;
        if (!seen.has(key)) {
          workspaces.push({
            type: 'clinic_admin',
            organizationId: org.id,
            organizationName: org.name,
            label: `Clinic Admin — ${org.name}`,
          });
          seen.add(key);
        }
      }

      if (
        org.type === 'PHARMACY' &&
        (m.role === 'PHARMACIST' || m.role === 'STAFF')
      ) {
        const key = `pharmacy:${org.id}`;
        if (!seen.has(key)) {
          workspaces.push({
            type: 'pharmacy',
            organizationId: org.id,
            organizationName: org.name,
            label: `Pharmacy — ${org.name}`,
          });
          seen.add(key);
        }
      }

      if (org.type === 'PLATFORM' && m.role === 'PLATFORM_ADMIN') {
        if (!seen.has('platform_admin')) {
          workspaces.push({
            type: 'platform_admin',
            organizationId: org.id,
            organizationName: org.name,
            label: 'Platform Admin',
          });
          seen.add('platform_admin');
        }
      }
    }

    const defaultWorkspace = workspaces.length === 1 ? workspaces[0].type : null;

    return {
      memberships: membershipViews,
      workspaces,
      defaultWorkspace,
      patientId: user.patientRecord?.id,
      doctorId: user.doctorRecord?.id,
    };
  }

  isWorkspaceAllowed(
    workspaces: WorkspaceDescriptor[],
    type: WorkspaceType,
    organizationId?: string,
  ): boolean {
    return workspaces.some(
      (w) =>
        w.type === type &&
        (organizationId === undefined || w.organizationId === organizationId),
    );
  }

  private parsePermissions(raw: string): string[] {
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed.map(String) : [];
    } catch {
      return [];
    }
  }
}
