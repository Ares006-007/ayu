import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { OrganizationsService } from './organizations.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('v1/organizations')
export class OrganizationsController {
  constructor(private readonly orgService: OrganizationsService) {}

  @Get()
  @Roles('PLATFORM_ADMIN', 'DOCTOR', 'PHARMACIST', 'STAFF') // Patients usually don't list all organizations broadly unless it's a specific public endpoint
  async findAll() {
    return this.orgService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    // In a real implementation, you must check if the CurrentUser has permission to view this specific organization
    return this.orgService.findOne(id);
  }
}
