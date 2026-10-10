import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { JwtAuthGuard } from './guards/jwt-auth.guard.js';
import { CurrentUser } from './decorators/current-user.decorator.js';
import { AuthContextService } from './services/auth-context.service.js';
import { parseWorkspaceCookie } from './utils/cookie.util.js';
import type { AuthenticatedUser } from './types.js';

@Controller('v1/me')
export class MeController {
  constructor(private readonly authContextService: AuthContextService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getCurrentUser(
    @CurrentUser() user: AuthenticatedUser,
    @Req() request: Request,
  ) {
    const workspaceCookie = parseWorkspaceCookie(request.cookies?.ayu_workspace);
    return this.authContextService.buildCurrentUserResponse(
      user.userId,
      workspaceCookie?.workspace ?? user.activeWorkspace,
      workspaceCookie?.organizationId ?? user.activeOrganizationId,
    );
  }
}
