import { Test, TestingModule } from '@nestjs/testing';
import { AiGatewayService } from './ai-gateway.service.js';
import { AiConfigService } from '../ai-config.service.js';
import { OpenAiCompatibleProvider } from '../providers/openai-compatible.provider.js';

describe('AiGatewayService', () => {
  let service: AiGatewayService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AiGatewayService,
        {
          provide: AiConfigService,
          useValue: { getConfig: vitest.fn() }
        },
        {
          provide: OpenAiCompatibleProvider,
          useValue: { generateText: vitest.fn() }
        }
      ],
    }).compile();

    service = module.get<AiGatewayService>(AiGatewayService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
