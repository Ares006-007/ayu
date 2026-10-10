var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AuditService_1;
import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../database/database.module.js';
let AuditService = AuditService_1 = class AuditService {
    prisma;
    logger = new Logger(AuditService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async logEvent(event) {
        let safeMetadata = null;
        if (event.metadata) {
            const { password, token, ...safeData } = event.metadata;
            safeMetadata = JSON.stringify(safeData);
        }
        try {
            const record = await this.prisma.auditLog.create({
                data: {
                    actorId: event.actorId,
                    organizationId: event.organizationId,
                    action: event.action,
                    resourceType: event.resourceType,
                    resourceId: event.resourceId,
                    outcome: event.outcome,
                    requestId: event.requestId,
                    ipAddress: event.ipAddress,
                    userAgent: event.userAgent,
                    metadata: safeMetadata,
                }
            });
            this.logger.log(`Audit Event: ${event.action} on ${event.resourceType}:${event.resourceId} by ${event.actorId}`);
            return record;
        }
        catch (error) {
            const err = error;
            this.logger.error(`Failed to write audit log: ${err.message}`, err.stack);
        }
    }
};
AuditService = AuditService_1 = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], AuditService);
export { AuditService };
//# sourceMappingURL=audit.service.js.map