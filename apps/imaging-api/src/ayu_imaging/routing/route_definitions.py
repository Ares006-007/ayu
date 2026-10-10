from enum import Enum

from pydantic import BaseModel


class RouteEnum(str, Enum):
    CT_CHEST = "CT_CHEST"
    CT_ABDOMEN_PELVIS = "CT_ABDOMEN_PELVIS"
    CT_HEAD = "CT_HEAD"
    MRI_BRAIN = "MRI_BRAIN"
    MRI_SPINE = "MRI_SPINE"
    MRI_PROSTATE = "MRI_PROSTATE"
    XRAY_CHEST = "XRAY_CHEST"
    XRAY_MUSCULOSKELETAL = "XRAY_MUSCULOSKELETAL"
    PET_CT = "PET_CT"
    UNSUPPORTED = "UNSUPPORTED"
    NOT_YET_CONFIGURED = "NOT_YET_CONFIGURED"

class PipelineDefinition(BaseModel):
    route: RouteEnum
    version: str
    required_input_series: list[str]
    segmentation_adapter: str | None = None
    prediction_adapters: list[str] = []
    radiomics_parameter_set: str | None = None
    required_review: bool = True
    limitations: list[str] = []
    reason_code: str = "DEFAULT"
