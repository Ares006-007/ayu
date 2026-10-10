import { Injectable, Logger } from '@nestjs/common';

export interface PromptDefinition {
  id: string;
  version: string;
  useCase: string;
  systemPrompt: string;
  approvalStatus: 'APPROVED' | 'DRAFT';
}

@Injectable()
export class PromptRegistryService {
  private readonly logger = new Logger(PromptRegistryService.name);
  
  // In a real implementation, this loads from database (AIModelDefinition, etc) or configured files
  private readonly prompts = new Map<string, PromptDefinition>();

  constructor() {
    this.registerBuiltInPrompts();
  }

  private registerBuiltInPrompts() {
    this.prompts.set('prescription-extraction', {
      id: 'prompt-rx-001',
      version: '1.0.0',
      useCase: 'PRESCRIPTION_IMAGE_EXTRACTION',
      systemPrompt: 'You are a highly constrained medical extraction AI. Extract the fields into the provided schema. Do not diagnose or prescribe.',
      approvalStatus: 'APPROVED',
    });
    
    // Additional prompts...
  }

  getPrompt(useCase: string): PromptDefinition {
    // Basic mapping for demo
    const key = useCase === 'PRESCRIPTION_IMAGE_EXTRACTION' ? 'prescription-extraction' : null;
    
    if (key && this.prompts.has(key)) {
      return this.prompts.get(key)!;
    }

    // Generic safe fallback prompt
    return {
      id: 'prompt-generic-001',
      version: '1.0.0',
      useCase,
      systemPrompt: 'You are a helpful and safe healthcare assistant. Adhere strictly to the JSON schema provided.',
      approvalStatus: 'APPROVED',
    };
  }
}
