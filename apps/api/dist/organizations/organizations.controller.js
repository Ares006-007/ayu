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
import { Controller, Get, Param, UseGuards, ForbiddenException, Req } from '@nestjs/common';
import { OrganizationsService } from './organizations.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import { AuditService } from '../audit/audit.service.js';
let OrganizationsController = class OrganizationsController {
    orgService;
    auditService;
    constructor(orgService, auditService) {
        this.orgService = orgService;
        this.auditService = auditService;
    }
    async findAll(user) {
        const orgIds = user.memberships.map((m) => m.organizationId);
        if (!orgIds.length) {
            return [];
        }
        return this.orgService.findByIds(orgIds);
    }
    async findOne(id, user, request) {
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
};
__decorate([
    Get(),
    __param(0, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OrganizationsController.prototype, "findAll", null);
__decorate([
    Get(':id'),
    __param(0, Param('id')),
    __param(1, CurrentUser()),
    __param(2, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], OrganizationsController.prototype, "findOne", null);
OrganizationsController = __decorate([
    UseGuards(JwtAuthGuard),
    Controller('v1/organizations'),
    __metadata("design:paramtypes", [OrganizationsService,
        AuditService])
], OrganizationsController);
export { OrganizationsController };
//# sourceMappingURL=organizations.controller.js.map