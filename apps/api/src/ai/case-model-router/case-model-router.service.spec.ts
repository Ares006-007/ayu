import { Test, TestingModule } from '@nestjs/testing';
import { CaseModelRouterService } from './case-model-router.service.js';
import { ModelRegistryService } from '../model-registry/model-registry.service.js';

describe('CaseModelRouterService', () => {
  let service: CaseModelRouterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CaseModelRouterService,
        {
          provide: ModelRegistryService,
          useValue: { resolveModel: vitest.fn() }
        }
      ],
    }).compile();

    service = module.get<CaseModelRouterService>(CaseModelRouterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
