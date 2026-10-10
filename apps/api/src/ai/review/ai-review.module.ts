import { Module } from '@nestjs/common';
import { AiReviewService } from './ai-review.service.js';
import { DatabaseModule } from '../../database/database.module.js';

@Module({
  imports: [DatabaseModule],
  providers: [AiReviewService],
  exports: [AiReviewService],
})
export class AiReviewModule {}
