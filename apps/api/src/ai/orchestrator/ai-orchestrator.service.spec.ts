import { Test, TestingModule } from '@nestjs/testing';
import { AiOrchestratorService } from './ai-orchestrator.service.js';
import { PrismaService } from '../../database/database.module.js';
import { CaseModelRouterService } from '../case-model-router/case-model-router.service.js';
import { AiGatewayService } from '../ai-gateway/ai-gateway.service.js';
import { PromptRegistryService } from '../prompt-registry/prompt-registry.service.js';
import { SchemaRegistryService } from '../schema-registry/schema-registry.service.js';
import { AiReviewService } from '../review/ai-review.service.js';

describe('AiOrchestratorService', () => {
  let service: AiOrchestratorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AiOrchestratorService,
        {
          provide: PrismaService,
          useValue: { aIProcessingJob: { create: vitest.fn() } },
        },
        {
          provide: CaseModelRouterService,
          useValue: { getRouteForUseCase: vitest.fn() },
        },
        {
          provide: AiGatewayService,
          useValue: { generateStructured: vitest.fn() },
        },
        {
          provide: PromptRegistryService,
          useValue: { getPrompt: vitest.fn() },
        },
        {
          provide: SchemaRegistryService,
          useValue: { getSchema: vitest.fn(), validateData: vitest.fn() },
        },
        {
          provide: AiReviewService,
          useValue: { createReviewTask: vitest.fn() },
        },
      ],
    }).compile();

    service = module.get<AiOrchestratorService>(AiOrchestratorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
