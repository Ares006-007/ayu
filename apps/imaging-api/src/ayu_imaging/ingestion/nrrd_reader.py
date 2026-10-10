from pathlib import Path

import SimpleITK as sitk
import structlog

from ..domain.models import CanonicalMedicalImage

logger = structlog.get_logger(__name__)

class NrrdIngestionService:
    def __init__(self) -> None:
        pass

    def ingest_file(self, file_path: Path, study_id: str, series_id: str) -> CanonicalMedicalImage:
        """
        Reads an NRRD file using SimpleITK and converts it into the canonical medical image representation.
        """
        logger.info("Ingesting NRRD file via SimpleITK", path=str(file_path))
        
        try:
            # SimpleITK handles NRRD beautifully
            reader = sitk.ImageFileReader()
            reader.SetFileName(str(file_path))
            reader.ReadImageInformation()
            
            shape = reader.GetSize()
            spacing = reader.GetSpacing()
            origin = reader.GetOrigin()
            direction = reader.GetDirection()
            
            # Load full image
            img = reader.Execute()
            
            # Identify if it's a vector/sequence
            components = img.GetNumberOfComponentsPerPixel()
            if components > 1:
                logger.warning("NRRD contains vector data, not a scalar volume", components=components)
                
            canonical = CanonicalMedicalImage(
                study_id=study_id,
                series_id=series_id,
                source_format="NRRD",
                modality="UNKNOWN",
                shape=shape,
                spacing=spacing,
                origin=origin,
                direction_matrix=direction,
                canonical_orientation="UNKNOWN", # Will be determined in standardization phase
                data_type=img.GetPixelIDTypeAsString(),
                source_checksum="TODO_MD5",
                processing_history=[{"action": "ingest_nrrd", "version": "1.0.0"}],
                transform_to_source={
                    "original_origin": origin,
                    "original_direction": direction,
                    "original_spacing": spacing
                }
            )
            
            return canonical
            
        except Exception as e:
            logger.error("Failed to ingest NRRD file", error=str(e))
            raise ValueError(f"Invalid NRRD file: {e}")
