export interface SchemaDefinition {
    id: string;
    version: string;
    useCase: string;
    jsonSchema: Record<string, any>;
    approvalStatus: 'APPROVED' | 'DRAFT';
}
export declare class SchemaRegistryService {
    private readonly logger;
    private readonly schemas;
    constructor();
    private registerBuiltInSchemas;
    getSchema(useCase: string): SchemaDefinition;
}
