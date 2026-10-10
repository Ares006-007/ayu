import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { WORKSPACE_KEY } from '../decorators/workspace.decorator.js';
import type { WorkspaceType, AuthenticatedUser } from '../types.js';

@Injectable()
export class WorkspaceGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredWorkspaces = this.reflector.getAllAndOverride<WorkspaceType[]>(
      WORKSPACE_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredWorkspaces?.length) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user as AuthenticatedUser;

    if (!user?.activeWorkspace) {
      throw new ForbiddenException('No active workspace selected.');
    }

    if (!requiredWorkspaces.includes(user.activeWorkspace)) {
      throw new ForbiddenException('You do not have access to this workspace.');
    }

    return true;
  }
}
