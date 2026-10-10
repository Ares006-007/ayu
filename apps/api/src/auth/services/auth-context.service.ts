import { Injectable } from '@nestjs/common';
import { UsersService } from '../../users/users.service.js';
import { WorkspaceResolverService } from './workspace-resolver.service.js';
import {
  AuthenticatedUser,
  CurrentUserResponse,
  WorkspaceType,
} from '../types.js';

@Injectable()
export class AuthContextService {
  constructor(
    private readonly usersService: UsersService,
    private readonly workspaceResolver: WorkspaceResolverService,
  ) {}

  async buildAuthenticatedUser(
    userId: string,
    activeWorkspace?: WorkspaceType | null,
    activeOrganizationId?: string | null,
  ): Promise<AuthenticatedUser | null> {
    const user = await this.usersService.findById(userId);
    if (!user || user.status !== 'ACTIVE') return null;

    const resolved = await this.workspaceResolver.resolveForUser(userId);
    const roles = this.collectRoles(resolved.memberships);
    const permissions = resolved.memberships.flatMap((m) => m.permissions);

    let workspace = activeWorkspace ?? resolved.defaultWorkspace;
    let orgId = activeOrganizationId ?? null;

    if (workspace && !this.workspaceResolver.isWorkspaceAllowed(resolved.workspaces, workspace, orgId ?? undefined)) {
      workspace = resolved.defaultWorkspace;
      orgId = workspace
        ? resolved.workspaces.find((w) => w.type === workspace)?.organizationId ?? null
        : null;
    }

    if (workspace && !orgId) {
      orgId = resolved.workspaces.find((w) => w.type === workspace)?.organizationId ?? null;
    }

    return {
      userId: user.id,
      email: user.email,
      memberships: resolved.memberships,
      workspaces: resolved.workspaces,
      activeWorkspace: workspace,
      activeOrganizationId: orgId,
      permissions,
      roles,
      patientId: resolved.patientId,
      doctorId: resolved.doctorId,
    };
  }

  async buildCurrentUserResponse(
    userId: string,
    activeWorkspace?: WorkspaceType | null,
    activeOrganizationId?: string | null,
  ): Promise<CurrentUserResponse | null> {
    const user = await this.usersService.findById(userId);
    if (!user) return null;

    const resolved = await this.workspaceResolver.resolveForUser(userId);

    let workspace = activeWorkspace ?? resolved.defaultWorkspace;
    let orgId = activeOrganizationId ?? null;

    if (workspace && !this.workspaceResolver.isWorkspaceAllowed(resolved.workspaces, workspace, orgId ?? undefined)) {
      workspace = resolved.defaultWorkspace;
      orgId = workspace
        ? resolved.workspaces.find((w) => w.type === workspace)?.organizationId ?? null
        : null;
    }

    if (workspace && !orgId) {
      orgId = resolved.workspaces.find((w) => w.type === workspace)?.organizationId ?? null;
    }

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        emailVerified: Boolean(user.emailVerifiedAt),
      },
      memberships: resolved.memberships,
      availableWorkspaces: resolved.workspaces,
      defaultWorkspace: resolved.defaultWorkspace,
      activeWorkspace: workspace,
      activeOrganizationId: orgId,
    };
  }

  private collectRoles(memberships: { role: string }[]): string[] {
    const roles = new Set<string>();
    for (const m of memberships) {
      roles.add(m.role.toUpperCase());
    }
    return Array.from(roles);
  }
}
