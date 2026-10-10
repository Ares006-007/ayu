import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { SchemaDefinition, AIUseCase } from '../types.js';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';

@Injectable()
export class SchemaRegistryService {
  private readonly logger = new Logger(SchemaRegistryService.name);
  
  private readonly schemas = new Map<string, SchemaDefinition>();
  private readonly ajv: Ajv.default;

  constructor() {
    this.ajv = new Ajv.default({ allErrors: true });
    // Safe workaround for ajv-formats typing
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    addFormats.default(this.ajv);
    
    this.registerBuiltInSchemas();
  }

  private registerBuiltInSchemas() {
    this.schemas.set('PRESCRIPTION_IMAGE_EXTRACTION', {
      id: 'schema-rx-001',
      version: '1.0.0',
      useCase: 'PRESCRIPTION_IMAGE_EXTRACTION',
      approvalStatus: 'APPROVED',
      jsonSchema: {
        type: 'object',
        properties: {
          documentType: { type: 'string', const: 'prescription' },
          language: { type: 'string' },
          doctorName: { type: 'object', properties: { value: { type: ['string', 'null'] }, confidence: { type: 'number' } }, required: ['value', 'confidence'] },
          patientName: { type: 'object', properties: { value: { type: ['string', 'null'] }, confidence: { type: 'number' } }, required: ['value', 'confidence'] },
          date: { type: 'object', properties: { value: { type: ['string', 'null'] }, confidence: { type: 'number' } }, required: ['value', 'confidence'] },
          medicines: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                rawText: { type: 'string' },
                medicineName: { type: 'object', properties: { value: { type: ['string', 'null'] }, confidence: { type: 'number' } }, required: ['value', 'confidence'] },
                dose: { type: 'object', properties: { value: { type: ['string', 'null'] }, confidence: { type: 'number' } }, required: ['value', 'confidence'] },
                frequency: { type: 'object', properties: { value: { type: ['string', 'null'] }, confidence: { type: 'number' } }, required: ['value', 'confidence'] },
                duration: { type: 'object', properties: { value: { type: ['string', 'null'] }, confidence: { type: 'number' } }, required: ['value', 'confidence'] },
                route: { type: 'object', properties: { value: { type: ['string', 'null'] }, confidence: { type: 'number' } }, required: ['value', 'confidence'] },
                foodInstruction: { type: 'object', properties: { value: { type: ['string', 'null'] }, confidence: { type: 'number' } }, required: ['value', 'confidence'] },
                ambiguities: { type: 'array', items: { type: 'string' } }
              },
              required: ['rawText', 'medicineName', 'dose', 'frequency', 'duration', 'route', 'foodInstruction', 'ambiguities']
            }
          },
          additionalNotes: { type: 'array', items: { type: 'string' } },
          requiresHumanReview: { type: 'boolean' }
        },
        required: ['documentType', 'medicines', 'doctorName', 'patientName', 'date', 'additionalNotes', 'requiresHumanReview'],
        additionalProperties: false
      }
    });
    
    // Additional schemas would be added here
  }

  getSchema(useCase: AIUseCase): SchemaDefinition {
    if (this.schemas.has(useCase)) {
      return this.schemas.get(useCase)!;
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

  validateData<T>(useCase: AIUseCase, data: unknown): T {
    const schemaDef = this.getSchema(useCase);
    const validate = this.ajv.compile(schemaDef.jsonSchema);
    
    if (!validate(data)) {
      const errors = this.ajv.errorsText(validate.errors);
      this.logger.error(`Validation failed for useCase ${useCase}: ${errors}`);
      throw new HttpException(`Schema validation failed: ${errors}`, HttpStatus.UNPROCESSABLE_ENTITY);
    }
    
    return data as T;
  }
}
