var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@nestjs/common';
import { UsersService } from '../../users/users.service.js';
import { WorkspaceResolverService } from './workspace-resolver.service.js';
let AuthContextService = class AuthContextService {
    usersService;
    workspaceResolver;
    constructor(usersService, workspaceResolver) {
        this.usersService = usersService;
        this.workspaceResolver = workspaceResolver;
    }
    async buildAuthenticatedUser(userId, activeWorkspace, activeOrganizationId) {
        const user = await this.usersService.findById(userId);
        if (!user || user.status !== 'ACTIVE')
            return null;
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
    async buildCurrentUserResponse(userId, activeWorkspace, activeOrganizationId) {
        const user = await this.usersService.findById(userId);
        if (!user)
            return null;
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
    collectRoles(memberships) {
        const roles = new Set();
        for (const m of memberships) {
            roles.add(m.role.toUpperCase());
        }
        return Array.from(roles);
    }
};
AuthContextService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [UsersService,
        WorkspaceResolverService])
], AuthContextService);
export { AuthContextService };
//# sourceMappingURL=auth-context.service.js.map