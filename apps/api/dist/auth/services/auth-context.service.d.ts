import { UsersService } from '../../users/users.service.js';
import { WorkspaceResolverService } from './workspace-resolver.service.js';
import { AuthenticatedUser, CurrentUserResponse, WorkspaceType } from '../types.js';
export declare class AuthContextService {
    private readonly usersService;
    private readonly workspaceResolver;
    constructor(usersService: UsersService, workspaceResolver: WorkspaceResolverService);
    buildAuthenticatedUser(userId: string, activeWorkspace?: WorkspaceType | null, activeOrganizationId?: string | null): Promise<AuthenticatedUser | null>;
    buildCurrentUserResponse(userId: string, activeWorkspace?: WorkspaceType | null, activeOrganizationId?: string | null): Promise<CurrentUserResponse | null>;
    private collectRoles;
}
