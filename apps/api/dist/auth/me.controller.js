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
import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './guards/jwt-auth.guard.js';
import { CurrentUser } from './decorators/current-user.decorator.js';
import { AuthContextService } from './services/auth-context.service.js';
import { parseWorkspaceCookie } from './utils/cookie.util.js';
let MeController = class MeController {
    authContextService;
    constructor(authContextService) {
        this.authContextService = authContextService;
    }
    async getCurrentUser(user, request) {
        const workspaceCookie = parseWorkspaceCookie(request.cookies?.ayu_workspace);
        return this.authContextService.buildCurrentUserResponse(user.userId, workspaceCookie?.workspace ?? user.activeWorkspace, workspaceCookie?.organizationId ?? user.activeOrganizationId);
    }
};
__decorate([
    UseGuards(JwtAuthGuard),
    Get(),
    __param(0, CurrentUser()),
    __param(1, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], MeController.prototype, "getCurrentUser", null);
MeController = __decorate([
    Controller('v1/me'),
    __metadata("design:paramtypes", [AuthContextService])
], MeController);
export { MeController };
//# sourceMappingURL=me.controller.js.map