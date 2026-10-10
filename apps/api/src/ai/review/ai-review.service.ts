import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/database.module.js';

@Injectable()
export class AiReviewService {
  private readonly logger = new Logger(AiReviewService.name);

  constructor(private readonly prisma: PrismaService) {}

  async createReviewTask(jobId: string, reviewType: string, assignedRole: string) {
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

  async resolveReviewTask(taskId: string, userId: string, resolution: any) {
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

  async getPendingTasksForRole(role: string) {
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
}
