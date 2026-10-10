var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var SchemaRegistryService_1;
import { Injectable, Logger } from '@nestjs/common';
let SchemaRegistryService = SchemaRegistryService_1 = class SchemaRegistryService {
    logger = new Logger(SchemaRegistryService_1.name);
    schemas = new Map();
    constructor() {
        this.registerBuiltInSchemas();
    }
    registerBuiltInSchemas() {
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
    getSchema(useCase) {
        const key = useCase === 'PRESCRIPTION_IMAGE_EXTRACTION' ? 'prescription-extraction' : null;
        if (key && this.schemas.has(key)) {
            return this.schemas.get(key);
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
};
SchemaRegistryService = SchemaRegistryService_1 = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [])
], SchemaRegistryService);
export { SchemaRegistryService };
//# sourceMappingURL=schema-registry.service.js.map