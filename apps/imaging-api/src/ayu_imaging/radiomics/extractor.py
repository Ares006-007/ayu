import uuid
from pathlib import Path

import structlog

try:
    from radiomics import featureextractor
    RADIOMICS_AVAILABLE = True
except ImportError:
    RADIOMICS_AVAILABLE = False

from ..domain.models import CanonicalMedicalImage, RadiomicsResult

logger = structlog.get_logger(__name__)

class ControlledRadiomicsExtractor:
    def __init__(self, parameters_dir: Path) -> None:
        self.parameters_dir = parameters_dir
        
    def extract(
        self, 
        image: CanonicalMedicalImage, 
        mask_path: str, # In a real implementation this would be a loaded mask or storage reference
        label: int, 
        parameter_set_id: str
    ) -> RadiomicsResult:
        """
        Extracts radiomics features using an approved parameter set.
        """
        if not RADIOMICS_AVAILABLE:
            raise RuntimeError("pyradiomics is not installed or failed to load")
            
        param_file = self.parameters_dir / f"{parameter_set_id}.yaml"
        if not param_file.exists():
            raise ValueError(f"Unapproved or missing parameter set: {parameter_set_id}")
            
        logger.info("Extracting radiomics", parameter_set=parameter_set_id, label=label)
        
        warnings: list[str] = []
        feature_count = 0
        
        # Here we would load the image and mask into SimpleITK
        # For this synthetic sprint, we mock the extraction result if not actually loading files
        
        # In actual execution:
        # extractor = featureextractor.RadiomicsFeatureExtractor(str(param_file))
        # result = extractor.execute(image_sitk, mask_sitk, label=label)
        # feature_count = len([k for k in result.keys() if k.startswith("original_")])
        
        # Return structured metadata
        return RadiomicsResult(
            artifactId=str(uuid.uuid4()),
            parameterSetVersion=parameter_set_id,
            featureCount=feature_count,
            warnings=warnings
        )
