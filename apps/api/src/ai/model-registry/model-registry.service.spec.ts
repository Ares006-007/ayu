import { Test, TestingModule } from '@nestjs/testing';
import { ModelRegistryService } from './model-registry.service.js';

describe('ModelRegistryService', () => {
  let service: ModelRegistryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ModelRegistryService],
    }).compile();

    service = module.get<ModelRegistryService>(ModelRegistryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
