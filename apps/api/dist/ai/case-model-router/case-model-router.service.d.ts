import { ModelRegistryService } from '../model-registry/model-registry.service.js';
import { AIUseCase, RouteResult } from '../types.js';
export declare class CaseModelRouterService {
    private readonly modelRegistry;
    private readonly logger;
    constructor(modelRegistry: ModelRegistryService);
    getRouteForUseCase(useCase: AIUseCase): Promise<RouteResult>;
}
