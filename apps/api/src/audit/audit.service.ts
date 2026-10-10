import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../database/database.module.js';

export interface AuditEvent {
  actorId: string;
  organizationId?: string;
  action: string;
  resourceType: string;
  resourceId: string;
  outcome: 'SUCCESS' | 'FAILURE' | 'DENIED';
  requestId?: string;
  ipAddress?: string;
  userAgent?: string;
  metadata?: any;
}

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  constructor(private prisma: PrismaService) {}

  async logEvent(event: AuditEvent) {
    // Redact sensitive fields if any are accidentally passed in metadata
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
    } catch (error) {
      // Don't fail the main transaction if audit fails, but log heavily
      const err = error as Error;
      this.logger.error(`Failed to write audit log: ${err.message}`, err.stack);
    }
  }
}
