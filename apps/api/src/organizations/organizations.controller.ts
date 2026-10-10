import { Controller, Get, Param, UseGuards, ForbiddenException, Req } from '@nestjs/common';
import type { Request } from 'express';
import { OrganizationsService } from './organizations.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import { AuditService } from '../audit/audit.service.js';
import type { AuthenticatedUser } from '../auth/types.js';

@UseGuards(JwtAuthGuard)
@Controller('v1/organizations')
export class OrganizationsController {
  constructor(
    private readonly orgService: OrganizationsService,
    private readonly auditService: AuditService,
  ) {}

  @Get()
  async findAll(@CurrentUser() user: AuthenticatedUser) {
    const orgIds = user.memberships.map((m) => m.organizationId);
    if (!orgIds.length) {
      return [];
    }
    return this.orgService.findByIds(orgIds);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
    @Req() request: Request,
  ) {
    const membership = user.memberships.find((m) => m.organizationId === id);
    if (!membership) {
      await this.auditService.logEvent({
        actorId: user.userId,
        action: 'ACCESS_DENIED',
        resourceType: 'Organization',
        resourceId: id,
        outcome: 'DENIED',
        ipAddress: request.ip,
        userAgent: request.headers['user-agent'],
      });
      throw new ForbiddenException('You do not have access to this organization.');
    }

    return this.orgService.findOne(id);
  }
}
