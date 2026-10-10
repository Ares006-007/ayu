import { SchemaDefinition, AIUseCase } from '../types.js';
export declare class SchemaRegistryService {
    private readonly logger;
    private readonly schemas;
    private readonly ajv;
    constructor();
    private registerBuiltInSchemas;
    getSchema(useCase: AIUseCase): SchemaDefinition;
    validateData<T>(useCase: AIUseCase, data: unknown): T;
}
