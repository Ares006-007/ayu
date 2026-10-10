from abc import ABC, abstractmethod
from typing import Any

from ..domain.models import CanonicalMedicalImage
from ..routing.route_definitions import PipelineDefinition


class SegmentationAdapter(ABC):
    """
    Base interface for all segmentation execution.
    """
    
    @abstractmethod
    def validate_input(self, image: CanonicalMedicalImage, route: PipelineDefinition) -> bool:
        """Validates that the image geometry and type are suitable for the model."""
        
    @abstractmethod
    def run(self, image: CanonicalMedicalImage, context: dict[str, Any]) -> Any:
        """
        Executes the segmentation. 
        Returns the raw mask or handled object.
        """
        
    @abstractmethod
    def validate_output(self, result: Any) -> bool:
        """Validates that the output mask matches expected geometry and labels."""
        
    @abstractmethod
    def get_provenance(self) -> dict[str, Any]:
        """Returns the registered model ID, version, and checksum."""

class MockSegmentationAdapter(SegmentationAdapter):
    """For testing only."""
    
    def validate_input(self, image: CanonicalMedicalImage, route: PipelineDefinition) -> bool:
        return True
        
    def run(self, image: CanonicalMedicalImage, context: dict[str, Any]) -> Any:
        # Mock mask array
        return None
        
    def validate_output(self, result: Any) -> bool:
        return True
        
    def get_provenance(self) -> dict[str, Any]:
        return {
            "model_id": "mock-segmentation-v1",
            "version": "1.0",
            "checksum": "mock_checksum"
        }
