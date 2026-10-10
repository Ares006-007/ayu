import { describe, it, expect, vi, beforeEach } from 'vitest';
import { WorkspaceResolverService } from './workspace-resolver.service.js';

describe('WorkspaceResolverService', () => {
  const prisma = {
    user: { findUnique: vi.fn() },
    organizationMembership: { findMany: vi.fn() },
  };

  let service: WorkspaceResolverService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new WorkspaceResolverService(prisma as any);
  });

  it('resolves patient-only workspace', async () => {
    prisma.user.findUnique.mockResolvedValue({
      id: 'u1',
      patientRecord: { id: 'p1', status: 'ACTIVE' },
      doctorRecord: null,
    });
    prisma.organizationMembership.findMany.mockResolvedValue([]);

    const result = await service.resolveForUser('u1');

    expect(result.workspaces).toHaveLength(1);
    expect(result.workspaces[0].type).toBe('patient');
    expect(result.defaultWorkspace).toBe('patient');
  });

  it('resolves doctor workspace from clinic membership', async () => {
    prisma.user.findUnique.mockResolvedValue({
      id: 'u2',
      patientRecord: null,
      doctorRecord: { id: 'd1' },
    });
    prisma.organizationMembership.findMany.mockResolvedValue([
      {
        organizationId: 'org1',
        role: 'DOCTOR',
        status: 'ACTIVE',
        permissions: '[]',
        organization: { id: 'org1', name: 'Citycare', type: 'CLINIC' },
      },
    ]);

    const result = await service.resolveForUser('u2');

    expect(result.workspaces.some((w) => w.type === 'doctor')).toBe(true);
    expect(result.defaultWorkspace).toBe('doctor');
  });

  it('returns no default workspace for multi-workspace user', async () => {
    prisma.user.findUnique.mockResolvedValue({
      id: 'u3',
      patientRecord: { id: 'p1', status: 'ACTIVE' },
      doctorRecord: { id: 'd1' },
    });
    prisma.organizationMembership.findMany.mockResolvedValue([
      {
        organizationId: 'org1',
        role: 'DOCTOR',
        status: 'ACTIVE',
        permissions: '[]',
        organization: { id: 'org1', name: 'Citycare', type: 'CLINIC' },
      },
    ]);

    const result = await service.resolveForUser('u3');

    expect(result.workspaces.length).toBeGreaterThan(1);
    expect(result.defaultWorkspace).toBeNull();
  });

  it('ignores inactive memberships', async () => {
    prisma.user.findUnique.mockResolvedValue({
      id: 'u4',
      patientRecord: null,
      doctorRecord: { id: 'd1' },
    });
    prisma.organizationMembership.findMany.mockResolvedValue([
      {
        organizationId: 'org1',
        role: 'DOCTOR',
        status: 'INACTIVE',
        permissions: '[]',
        organization: { id: 'org1', name: 'Citycare', type: 'CLINIC' },
      },
    ]);

    const result = await service.resolveForUser('u4');

    expect(result.workspaces).toHaveLength(0);
  });
});
