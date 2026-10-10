import { Test, TestingModule } from '@nestjs/testing';
import { ModelRegistryService } from './model-registry.service.js';
import { PrismaService } from '../../database/database.module.js';
import { AiConfigService } from '../ai-config.service.js';

describe('ModelRegistryService', () => {
  let service: ModelRegistryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ModelRegistryService,
        {
          provide: AiConfigService,
          useValue: { getConfig: vitest.fn() }
        },
        {
          provide: PrismaService,
          useValue: { aIModelDefinition: { findFirst: vitest.fn() } }
        }
      ],
    }).compile();

    service = module.get<ModelRegistryService>(ModelRegistryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
