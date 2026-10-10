import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ImagingBridgeService } from './imaging-bridge.service.js';
import { AiOrchestratorModule } from '../orchestrator/ai-orchestrator.module.js';

@Module({
  imports: [ConfigModule, AiOrchestratorModule],
  providers: [ImagingBridgeService],
  exports: [ImagingBridgeService],
})
export class ImagingBridgeModule {}
