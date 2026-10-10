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
import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
let SchemaRegistryService = SchemaRegistryService_1 = class SchemaRegistryService {
    logger = new Logger(SchemaRegistryService_1.name);
    schemas = new Map();
    ajv;
    constructor() {
        this.ajv = new Ajv.default({ allErrors: true });
        addFormats.default(this.ajv);
        this.registerBuiltInSchemas();
    }
    registerBuiltInSchemas() {
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
    }
    getSchema(useCase) {
        if (this.schemas.has(useCase)) {
            return this.schemas.get(useCase);
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
    validateData(useCase, data) {
        const schemaDef = this.getSchema(useCase);
        const validate = this.ajv.compile(schemaDef.jsonSchema);
        if (!validate(data)) {
            const errors = this.ajv.errorsText(validate.errors);
            this.logger.error(`Validation failed for useCase ${useCase}: ${errors}`);
            throw new HttpException(`Schema validation failed: ${errors}`, HttpStatus.UNPROCESSABLE_ENTITY);
        }
        return data;
    }
};
SchemaRegistryService = SchemaRegistryService_1 = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [])
], SchemaRegistryService);
export { SchemaRegistryService };
//# sourceMappingURL=schema-registry.service.js.map