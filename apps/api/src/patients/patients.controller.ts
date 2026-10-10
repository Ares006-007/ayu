import { Controller, Get, Param, Req, UseGuards, ForbiddenException } from '@nestjs/common';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { WorkspaceGuard } from '../auth/guards/workspace.guard.js';
import { Workspace } from '../auth/decorators/workspace.decorator.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import { ObjectAuthorizationService } from '../auth/authorization/object-authorization.service.js';
import { PatientsService } from './patients.service.js';
import type { AuthenticatedUser } from '../auth/types.js';

@Controller('v1/patients')
@UseGuards(JwtAuthGuard, WorkspaceGuard)
export class PatientsController {
  constructor(
    private readonly patientsService: PatientsService,
    private readonly objectAuth: ObjectAuthorizationService,
  ) {}

  @Get('me')
  @Workspace('patient')
  async getMyProfile(@CurrentUser() user: AuthenticatedUser) {
    return this.patientsService.getPatientProfile(user.patientId!);
  }

  @Get(':id')
  @Workspace('patient', 'doctor')
  async getPatient(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
    @Req() request: Request,
  ) {
    const meta = { ipAddress: request.ip, userAgent: request.headers['user-agent'] };

    if (user.activeWorkspace === 'patient') {
      await this.objectAuth.assertPatientSelfAccess(user, id, meta);
    } else if (user.activeWorkspace === 'doctor') {
      await this.objectAuth.assertDoctorPatientAccess(user, id, meta);
    } else {
      throw new ForbiddenException('You do not have access to this patient record.');
    }

    return this.patientsService.getPatientProfile(id);
  }
}
