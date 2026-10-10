var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable, ForbiddenException, } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { WORKSPACE_KEY } from '../decorators/workspace.decorator.js';
let WorkspaceGuard = class WorkspaceGuard {
    reflector;
    constructor(reflector) {
        this.reflector = reflector;
    }
    canActivate(context) {
        const requiredWorkspaces = this.reflector.getAllAndOverride(WORKSPACE_KEY, [context.getHandler(), context.getClass()]);
        if (!requiredWorkspaces?.length) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        if (!user?.activeWorkspace) {
            throw new ForbiddenException('No active workspace selected.');
        }
        if (!requiredWorkspaces.includes(user.activeWorkspace)) {
            throw new ForbiddenException('You do not have access to this workspace.');
        }
        return true;
    }
};
WorkspaceGuard = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [Reflector])
], WorkspaceGuard);
export { WorkspaceGuard };
//# sourceMappingURL=workspace.guard.js.map