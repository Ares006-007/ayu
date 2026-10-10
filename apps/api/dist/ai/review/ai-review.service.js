var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AiReviewService_1;
import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/database.module.js';
let AiReviewService = AiReviewService_1 = class AiReviewService {
    prisma;
    logger = new Logger(AiReviewService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createReviewTask(jobId, reviewType, assignedRole) {
        this.logger.log(`Creating review task for job ${jobId} (Role: ${assignedRole})`);
        return this.prisma.aIReviewTask.create({
            data: {
                jobId,
                reviewType,
                assignedRole,
                status: 'PENDING',
            },
        });
    }
    async resolveReviewTask(taskId, userId, resolution) {
        this.logger.log(`Resolving review task ${taskId} by user ${userId}`);
        return this.prisma.aIReviewTask.update({
            where: { id: taskId },
            data: {
                status: 'RESOLVED',
                resolvedBy: userId,
                resolvedAt: new Date(),
                resolution: JSON.stringify(resolution),
            },
        });
    }
    async getPendingTasksForRole(role) {
        return this.prisma.aIReviewTask.findMany({
            where: {
                assignedRole: role,
                status: 'PENDING',
            },
            include: {
                job: true,
            },
        });
    }
};
AiReviewService = AiReviewService_1 = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], AiReviewService);
export { AiReviewService };
//# sourceMappingURL=ai-review.service.js.map