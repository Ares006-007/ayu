import { Test, TestingModule } from '@nestjs/testing';
import { PromptRegistryService } from './prompt-registry.service.js';

describe('PromptRegistryService', () => {
  let service: PromptRegistryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PromptRegistryService],
    }).compile();

    service = module.get<PromptRegistryService>(PromptRegistryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
