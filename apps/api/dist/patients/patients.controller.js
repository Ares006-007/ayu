var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Controller, Get, Param, Req, UseGuards, ForbiddenException } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { WorkspaceGuard } from '../auth/guards/workspace.guard.js';
import { Workspace } from '../auth/decorators/workspace.decorator.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import { ObjectAuthorizationService } from '../auth/authorization/object-authorization.service.js';
import { PatientsService } from './patients.service.js';
let PatientsController = class PatientsController {
    patientsService;
    objectAuth;
    constructor(patientsService, objectAuth) {
        this.patientsService = patientsService;
        this.objectAuth = objectAuth;
    }
    async getMyProfile(user) {
        return this.patientsService.getPatientProfile(user.patientId);
    }
    async getPatient(id, user, request) {
        const meta = { ipAddress: request.ip, userAgent: request.headers['user-agent'] };
        if (user.activeWorkspace === 'patient') {
            await this.objectAuth.assertPatientSelfAccess(user, id, meta);
        }
        else if (user.activeWorkspace === 'doctor') {
            await this.objectAuth.assertDoctorPatientAccess(user, id, meta);
        }
        else {
            throw new ForbiddenException('You do not have access to this patient record.');
        }
        return this.patientsService.getPatientProfile(id);
    }
    async getPatientDashboard(id, user, request) {
        const meta = { ipAddress: request.ip, userAgent: request.headers['user-agent'] };
        await this.objectAuth.assertPatientSelfAccess(user, id, meta);
        return this.patientsService.getPatientDashboard(id);
    }
};
__decorate([
    Get('me'),
    Workspace('patient'),
    __param(0, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PatientsController.prototype, "getMyProfile", null);
__decorate([
    Get(':id'),
    Workspace('patient', 'doctor'),
    __param(0, Param('id')),
    __param(1, CurrentUser()),
    __param(2, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], PatientsController.prototype, "getPatient", null);
__decorate([
    Get(':id/dashboard'),
    Workspace('patient'),
    __param(0, Param('id')),
    __param(1, CurrentUser()),
    __param(2, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], PatientsController.prototype, "getPatientDashboard", null);
PatientsController = __decorate([
    Controller('v1/patients'),
    UseGuards(JwtAuthGuard, WorkspaceGuard),
    __metadata("design:paramtypes", [PatientsService,
        ObjectAuthorizationService])
], PatientsController);
export { PatientsController };
//# sourceMappingURL=patients.controller.js.map