import { Injectable, Logger } from '@nestjs/common';

export interface SchemaDefinition {
  id: string;
  version: string;
  useCase: string;
  jsonSchema: Record<string, any>;
  approvalStatus: 'APPROVED' | 'DRAFT';
}

@Injectable()
export class SchemaRegistryService {
  private readonly logger = new Logger(SchemaRegistryService.name);
  
  private readonly schemas = new Map<string, SchemaDefinition>();

  constructor() {
    this.registerBuiltInSchemas();
  }

  private registerBuiltInSchemas() {
    // Prescription schema as requested
    this.schemas.set('prescription-extraction', {
      id: 'schema-rx-001',
      version: '1.0.0',
      useCase: 'PRESCRIPTION_IMAGE_EXTRACTION',
      approvalStatus: 'APPROVED',
      jsonSchema: {
        type: 'object',
        properties: {
          documentType: { type: 'string', enum: ['prescription'] },
          language: { type: 'string' },
          medicines: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                rawText: { type: 'string' },
                medicineName: { type: 'object', properties: { value: { type: ['string', 'null'] }, confidence: { type: 'number' } } },
                dose: { type: 'object', properties: { value: { type: ['string', 'null'] }, confidence: { type: 'number' } } },
                frequency: { type: 'object', properties: { value: { type: ['string', 'null'] }, confidence: { type: 'number' } } },
                ambiguities: { type: 'array', items: { type: 'string' } }
              },
              required: ['rawText']
            }
          },
          requiresHumanReview: { type: 'boolean' }
        },
        required: ['documentType', 'medicines', 'requiresHumanReview']
      }
    });
  }

  getSchema(useCase: string): SchemaDefinition {
    const key = useCase === 'PRESCRIPTION_IMAGE_EXTRACTION' ? 'prescription-extraction' : null;
    
    if (key && this.schemas.has(key)) {
      return this.schemas.get(key)!;
    }

    return {
      id: 'schema-generic-001',
      version: '1.0.0',
      useCase,
      approvalStatus: 'APPROVED',
      jsonSchema: {
        type: 'object',
        properties: {
          result: { type: 'string' }
        },
        required: ['result']
      }
    };
  }
}
