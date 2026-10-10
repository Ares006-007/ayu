/**
 * AYU AI Pipeline — Shared Types & Enums
 *
 * Central type definitions for the AI orchestration layer.
 * Every use case, model alias, review policy, and structured output
 * contract is defined here so nothing is ad-hoc.
 */

// ──────────────────────────────────────────────────────────────
// Use-Case Enum
// ──────────────────────────────────────────────────────────────

export const AI_USE_CASES = [
  'DOCUMENT_CLASSIFICATION',
  'PRESCRIPTION_IMAGE_EXTRACTION',
  'PRESCRIPTION_PDF_EXTRACTION',
  'HANDWRITTEN_PRESCRIPTION_EXTRACTION',
  'MEDICAL_REPORT_EXTRACTION',
  'LAB_REPORT_EXTRACTION',
  'DISCHARGE_SUMMARY_EXTRACTION',
  'LONG_MEDICAL_DOCUMENT_SUMMARY',
  'PATIENT_TIMELINE_SUMMARY',
  'DOCTOR_CLINICAL_SUMMARY',
  'PHARMACY_PRESCRIPTION_REVIEW',
  'MEDICINE_NAME_NORMALIZATION',
  'AYUSH_PATIENT_RESPONSE',
  'AYUSH_ADMINISTRATIVE_RESPONSE',
  'IMAGING_REPORT_DRAFT',
  'GENERAL_NON_CLINICAL_TEXT',
  'UNSUPPORTED_OR_HIGH_RISK',
] as const;

export type AIUseCase = (typeof AI_USE_CASES)[number];

// ──────────────────────────────────────────────────────────────
// Model Alias Enum
// ──────────────────────────────────────────────────────────────

export const MODEL_ALIASES = [
  'MEDICAL_TEXT_PRIMARY',
  'MEDICAL_TEXT_REVIEWER',
  'DOCUMENT_VISION_PRIMARY',
  'LONG_DOCUMENT_PRIMARY',
  'MULTIMODAL_REVIEWER',
  'HIGH_RISK_REVIEWER',
  'OPEN_VISION_SECONDARY',
  'DOCUMENT_REVIEWER',
  'GENERAL_TEXT_FALLBACK',
  'FAST_CLASSIFIER',
  'SAFE_FORMATTER',
] as const;

export type ModelAlias = (typeof MODEL_ALIASES)[number];

// ──────────────────────────────────────────────────────────────
// Routing Policy
// ──────────────────────────────────────────────────────────────

export type HumanReviewPolicy = 'REQUIRED' | 'CONDITIONAL' | 'OPTIONAL' | 'NONE';

export interface RouteResult {
  useCase: AIUseCase;
  primaryModelAlias: ModelAlias;
  secondaryModelAlias?: ModelAlias;
  reviewerModelAlias?: ModelAlias;
  humanReviewPolicy: HumanReviewPolicy;
  /** When true, local/deterministic parsing should run before any model call */
  localParsingFirst: boolean;
  /** When true, rejects automated completion entirely */
  rejectAutomated: boolean;
}

// ──────────────────────────────────────────────────────────────
// Prompt Registry Types
// ──────────────────────────────────────────────────────────────

export interface UseCaseContext {
  patientId?: string;
  documentId?: string;
  doctorId?: string;
  organizationId?: string;
  [key: string]: any;
}

export interface PromptDefinition {
  id: string;
  version: string;
  useCase: AIUseCase;
  systemPrompt: string;
  safetyConstraints: string[];
  compatibleModelAliases: ModelAlias[];
  approvedDataClassification: string;
  approvalStatus: 'APPROVED' | 'DRAFT' | 'DEPRECATED';
  approvalOwner: string;
  changeNotes: string;
}

// ──────────────────────────────────────────────────────────────
// Schema Registry Types
// ──────────────────────────────────────────────────────────────

export interface SchemaDefinition {
  id: string;
  version: string;
  useCase: AIUseCase;
  jsonSchema: Record<string, unknown>;
  approvalStatus: 'APPROVED' | 'DRAFT' | 'DEPRECATED';
}

// ──────────────────────────────────────────────────────────────
// Structured Output Envelope
// ──────────────────────────────────────────────────────────────

export interface AIStructuredOutput<T = unknown> {
  useCase: AIUseCase;
  modelAlias: ModelAlias;
  providerModelId: string;
  promptVersion: string;
  schemaVersion: string;
  sourceReferences: string[];
  data: T;
  confidence: ConfidenceSummary;
  warnings: string[];
  requiresHumanReview: boolean;
  createdAt: string;
}

export interface ConfidenceSummary {
  overall: number;
  fieldConfidences: Record<string, number>;
  lowConfidenceFields: string[];
}

// ──────────────────────────────────────────────────────────────
// Prescription Extraction Schema
// ──────────────────────────────────────────────────────────────

export interface ExtractedMedicineItem {
  rawText: string;
  medicineName: { value: string | null; confidence: number };
  dose: { value: string | null; confidence: number };
  frequency: { value: string | null; confidence: number };
  duration: { value: string | null; confidence: number };
  route: { value: string | null; confidence: number };
  foodInstruction: { value: string | null; confidence: number };
  ambiguities: string[];
}

export interface PrescriptionExtractionResult {
  documentType: 'prescription';
  language: string;
  doctorName: { value: string | null; confidence: number };
  patientName: { value: string | null; confidence: number };
  date: { value: string | null; confidence: number };
  medicines: ExtractedMedicineItem[];
  additionalNotes: string[];
  requiresHumanReview: boolean;
}

// ──────────────────────────────────────────────────────────────
// Lab Report Extraction Schema
// ──────────────────────────────────────────────────────────────

export interface LabReportRow {
  panelName: string | null;
  testName: string;
  rawValueText: string;
  parsedNumericValue: number | null;
  unit: string | null;
  referenceRange: string | null;
  sourceAbnormalFlag: string | null;
  collectionDate: string | null;
  reportDate: string | null;
  sourcePage: number | null;
  sourceTable: number | null;
  sourceRow: number | null;
  confidence: number;
  parsingStatus: 'COMPLETE' | 'PARTIAL' | 'AMBIGUOUS' | 'FAILED';
  ambiguityWarnings: string[];
}

export interface LabReportExtractionResult {
  documentType: 'lab_report';
  labName: { value: string | null; confidence: number };
  patientName: { value: string | null; confidence: number };
  collectionDate: { value: string | null; confidence: number };
  reportDate: { value: string | null; confidence: number };
  rows: LabReportRow[];
  warnings: string[];
  requiresHumanReview: boolean;
}

// ──────────────────────────────────────────────────────────────
// Medical Report Extraction Schema
// ──────────────────────────────────────────────────────────────

export interface MedicalReportExtractionResult {
  documentType: 'medical_report';
  reportType: string;
  summary: string;
  findings: Array<{
    category: string;
    description: string;
    confidence: number;
  }>;
  recommendations: string[];
  requiresHumanReview: boolean;
}

// ──────────────────────────────────────────────────────────────
// Imaging Report Draft Schema
// ──────────────────────────────────────────────────────────────

export interface ImagingReportDraft {
  route: string;
  pipelineVersion: string;
  sourceArtifactReferences: string[];
  qualityResult: {
    usable: boolean;
    level: string;
    flags: string[];
  };
  segmentationArtifactReferences: string[];
  measurements: Array<{
    name: string;
    value: number;
    unit: string;
    methodVersion: string;
  }>;
  radiomicsArtifactReference: string | null;
  predictions: Array<{
    task: string;
    result: string;
    confidence: number;
    modelVersion: string;
  }>;
  draftText: string;
  limitations: string[];
  requiresClinicianReview: boolean;
}

// ──────────────────────────────────────────────────────────────
// AYUSH Response Schema
// ──────────────────────────────────────────────────────────────

export interface AyushResponseResult {
  responseText: string;
  sourceType: 'TEMPLATE' | 'AI_GENERATED';
  sourceReferences: string[];
  disclaimers: string[];
  requiresReview: boolean;
}

// ──────────────────────────────────────────────────────────────
// Summary Draft Schema
// ──────────────────────────────────────────────────────────────

export interface ClinicalSummaryResult {
  summaryText: string;
  sections: Array<{
    title: string;
    content: string;
  }>;
  sourceReferences: string[];
  requiresReview: boolean;
}

// ──────────────────────────────────────────────────────────────
// Disagreement Result
// ──────────────────────────────────────────────────────────────

export interface DisagreementResult {
  primaryModelAlias: string;
  secondaryModelAlias: string;
  conflictingFields: Array<{
    fieldPath: string;
    primaryValue: unknown;
    secondaryValue: unknown;
    resolution: 'USE_PRIMARY' | 'USE_SECONDARY' | 'NEEDS_REVIEW';
  }>;
  overallAgreement: number;
  requiresHumanReview: boolean;
}
