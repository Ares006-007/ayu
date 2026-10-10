from datetime import UTC, datetime, timezone
from typing import Any, Literal

from pydantic import BaseModel, Field


class QualityFlag(BaseModel):
    code: str
    severity: Literal["INFO", "WARNING", "ERROR"]
    message: str

class QualityResult(BaseModel):
    usable: bool
    level: Literal["ADEQUATE", "MARGINAL", "UNUSABLE"]
    flags: list[QualityFlag] = Field(default_factory=list)

class CanonicalMedicalImage(BaseModel):
    """
    The canonical typed structure for a loaded medical image.
    Contains all spatial properties and processing history.
    """
    study_id: str
    series_id: str
    source_format: Literal["DICOM", "NIFTI", "NRRD", "UNKNOWN"]
    modality: str
    body_region: str | None = None
    
    # We do not type hint the pixel array directly as `np.ndarray` 
    # to maintain simple pydantic serialization, but in memory it is an array.
    # In a full app, this might be a handle to an ObjectStore reference or custom type
    pixel_array_ref: str | None = None 
    
    # Geometry
    shape: tuple[int, ...]
    spacing: tuple[float, ...]
    origin: tuple[float, ...]
    direction_matrix: tuple[float, ...]
    affine: tuple[tuple[float, ...], ...] | None = None
    canonical_orientation: str = "LPS"
    
    # Metadata
    data_type: str
    intensity_unit: str = "UNKNOWN"
    source_checksum: str
    deidentified_state: bool = False
    
    # Provenance
    conversion_version: str = "1.0.0"
    processing_history: list[dict[str, Any]] = Field(default_factory=list)
    transform_to_source: dict[str, Any] | None = None

class PredictionResult(BaseModel):
    task: str
    label: str
    score: float
    threshold: float
    modelId: str
    modelVersion: str
    calibrationVersion: str
    limitations: list[str] = Field(default_factory=list)

class RadiomicsResult(BaseModel):
    artifactId: str
    parameterSetVersion: str
    featureCount: int
    warnings: list[str] = Field(default_factory=list)

class MeasurementResult(BaseModel):
    name: str
    value: float
    unit: str
    sourceSegmentationId: str
    methodVersion: str

class SegmentationResult(BaseModel):
    id: str
    labelSet: list[str]
    artifactId: str
    modelId: str
    modelVersion: str
    modelChecksum: str
    reviewStatus: Literal["UNREVIEWED", "REVIEWED", "REJECTED"] = "UNREVIEWED"

class PipelineRef(BaseModel):
    route: str
    version: str

class SourceRef(BaseModel):
    format: str
    modality: str
    seriesIds: list[str]
    checksums: list[str]
    deidentified: bool

class ImagingAnalysisResult(BaseModel):
    """
    The structured result conforming to the contract provided to the AI agent orchestrator.
    """
    jobId: str
    studyId: str
    pipeline: PipelineRef
    source: SourceRef
    quality: QualityResult
    segmentations: list[SegmentationResult] = Field(default_factory=list)
    measurements: list[MeasurementResult] = Field(default_factory=list)
    radiomics: RadiomicsResult | None = None
    predictions: list[PredictionResult] = Field(default_factory=list)
    requiresClinicianReview: bool = True
    createdAt: str = Field(default_factory=lambda: datetime.now(UTC).isoformat())
