import structlog

from ..domain.models import CanonicalMedicalImage, QualityResult
from .route_definitions import PipelineDefinition, RouteEnum

logger = structlog.get_logger(__name__)

class DeterministicRouter:
    """
    Routes an imaging study to an appropriate pipeline based on modality, body region, and quality.
    """
    
    def determine_route(self, image: CanonicalMedicalImage, quality: QualityResult) -> PipelineDefinition:
        
        # Base quality check
        if not quality.usable:
            logger.info("Routing to UNSUPPORTED due to unusable quality")
            return PipelineDefinition(
                route=RouteEnum.UNSUPPORTED,
                version="1.0.0",
                required_input_series=[],
                reason_code="UNUSABLE_QUALITY",
                limitations=["Image quality is insufficient for processing"]
            )
            
        modality = image.modality.upper()
        
        # Simple heuristic mapping for this sprint
        if modality == "CT":
            # For now, default all CT to NOT_YET_CONFIGURED since no models are validated in this sprint
            return PipelineDefinition(
                route=RouteEnum.NOT_YET_CONFIGURED,
                version="1.0.0",
                required_input_series=[image.series_id],
                reason_code="NO_VALIDATED_MODEL",
                limitations=["No clinically validated model available for this modality"]
            )
        elif modality == "MR":
            return PipelineDefinition(
                route=RouteEnum.NOT_YET_CONFIGURED,
                version="1.0.0",
                required_input_series=[image.series_id],
                reason_code="NO_VALIDATED_MODEL",
                limitations=["No clinically validated model available for this modality"]
            )
        else:
            return PipelineDefinition(
                route=RouteEnum.UNSUPPORTED,
                version="1.0.0",
                required_input_series=[],
                reason_code="UNSUPPORTED_MODALITY",
                limitations=[f"Modality {modality} is not supported"]
            )
