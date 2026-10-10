var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var PromptRegistryService_1;
import { Injectable, Logger } from '@nestjs/common';
let PromptRegistryService = PromptRegistryService_1 = class PromptRegistryService {
    logger = new Logger(PromptRegistryService_1.name);
    prompts = new Map();
    constructor() {
        this.registerBuiltInPrompts();
    }
    registerBuiltInPrompts() {
        this.prompts.set('PRESCRIPTION_IMAGE_EXTRACTION', {
            id: 'prompt-rx-image-001',
            version: '1.0.0',
            useCase: 'PRESCRIPTION_IMAGE_EXTRACTION',
            systemPrompt: 'You are a highly constrained medical extraction AI. Extract the fields into the provided schema. Do not diagnose, infer, or prescribe. Extract exactly what is written.',
            safetyConstraints: [
                'Never change medicines, doses, or frequencies.',
                'If a value is unreadable, leave it null and mark confidence as 0.',
                'Do not verify the clinical appropriateness of the prescription.'
            ],
            compatibleModelAliases: ['DOCUMENT_VISION_PRIMARY', 'OPEN_VISION_SECONDARY', 'MEDICAL_TEXT_REVIEWER'],
            approvedDataClassification: 'APPROVED_FOR_HEALTH_DATA',
            approvalStatus: 'APPROVED',
            approvalOwner: 'sysadmin',
            changeNotes: 'Initial production prompt for image extraction.',
        });
        this.prompts.set('LAB_REPORT_EXTRACTION', {
            id: 'prompt-lab-001',
            version: '1.0.0',
            useCase: 'LAB_REPORT_EXTRACTION',
            systemPrompt: 'You are a lab report extraction assistant. Your task is to resolve parsing ambiguities in lab reports. Output the values exactly as they appear in the text. Do not interpret the results.',
            safetyConstraints: [
                'Preserve exactly: Test name, Value, Unit, Reference range, Abnormal flags.',
                'Never let an LLM reinterpret lab values into diagnoses.',
                'Do not invent missing ranges or convert units.'
            ],
            compatibleModelAliases: ['DOCUMENT_VISION_PRIMARY', 'MEDICAL_TEXT_PRIMARY'],
            approvedDataClassification: 'APPROVED_FOR_HEALTH_DATA',
            approvalStatus: 'APPROVED',
            approvalOwner: 'sysadmin',
            changeNotes: 'Initial lab extraction prompt.',
        });
        this.prompts.set('IMAGING_REPORT_DRAFT', {
            id: 'prompt-imaging-001',
            version: '1.0.0',
            useCase: 'IMAGING_REPORT_DRAFT',
            systemPrompt: 'You are not a radiologist and you do not inspect raw medical images directly. You must not infer findings from raw pixels. You may draft a readable report only from source-grounded structured imaging outputs. Every draft report must be labeled as AI-generated.',
            safetyConstraints: [
                'Must not infer findings from raw pixels.',
                'Must preserve quality warnings, limitations, and provenance.',
                'Must not hide model disagreement.',
                'Must not create unsupported findings.'
            ],
            compatibleModelAliases: ['MEDICAL_TEXT_PRIMARY', 'MULTIMODAL_REVIEWER'],
            approvedDataClassification: 'APPROVED_FOR_HEALTH_DATA',
            approvalStatus: 'APPROVED',
            approvalOwner: 'sysadmin',
            changeNotes: 'Mandatory safety constraints implemented.',
        });
        this.prompts.set('AYUSH_PATIENT_RESPONSE', {
            id: 'prompt-ayush-001',
            version: '1.0.0',
            useCase: 'AYUSH_PATIENT_RESPONSE',
            systemPrompt: 'You are AYUSH, a helpful healthcare assistant for the AYU platform. Be concise, polite, and helpful. You must never diagnose autonomously, verify prescriptions, change medicines, or activate reminders from unverified data.',
            safetyConstraints: [
                'Never diagnose.',
                'Never change medicines.',
                'Explain verified instructions only.',
            ],
            compatibleModelAliases: ['SAFE_FORMATTER', 'GENERAL_TEXT_FALLBACK'],
            approvedDataClassification: 'APPROVED_FOR_HEALTH_DATA',
            approvalStatus: 'APPROVED',
            approvalOwner: 'sysadmin',
            changeNotes: 'AYUSH safety fallback prompt.',
        });
    }
    getPrompt(useCase) {
        if (this.prompts.has(useCase)) {
            return this.prompts.get(useCase);
        }
        return {
            id: 'prompt-generic-001',
            version: '1.0.0',
            useCase,
            systemPrompt: 'You are a highly constrained AI assistant. You must adhere strictly to the JSON schema provided and never improvise clinical facts.',
            safetyConstraints: ['Fallback safety active: reject automated completion if unsure.'],
            compatibleModelAliases: ['GENERAL_TEXT_FALLBACK'],
            approvedDataClassification: 'RESTRICTED',
            approvalStatus: 'APPROVED',
            approvalOwner: 'sysadmin',
            changeNotes: 'Auto-generated fallback.',
        };
    }
};
PromptRegistryService = PromptRegistryService_1 = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [])
], PromptRegistryService);
export { PromptRegistryService };
//# sourceMappingURL=prompt-registry.service.js.map