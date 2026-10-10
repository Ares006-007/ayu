var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { DocumentPipelineService } from './document-pipeline.service.js';
import { AiOrchestratorModule } from '../../orchestrator/ai-orchestrator.module.js';
let DocumentPipelineModule = class DocumentPipelineModule {
};
DocumentPipelineModule = __decorate([
    Module({
        imports: [AiOrchestratorModule],
        providers: [DocumentPipelineService],
        exports: [DocumentPipelineService],
    })
], DocumentPipelineModule);
export { DocumentPipelineModule };
//# sourceMappingURL=document-pipeline.module.js.map