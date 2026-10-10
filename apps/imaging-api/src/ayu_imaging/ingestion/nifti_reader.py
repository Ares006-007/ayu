from pathlib import Path

import nibabel as nib
import numpy as np
import structlog

from ..domain.models import CanonicalMedicalImage

logger = structlog.get_logger(__name__)

class NiftiIngestionService:
    def __init__(self) -> None:
        pass

    def ingest_file(self, file_path: Path, study_id: str, series_id: str) -> CanonicalMedicalImage:
        """
        Reads a NIfTI file and converts it into the canonical medical image representation.
        """
        logger.info("Ingesting NIfTI file", path=str(file_path))
        
        try:
            # We load the image
            img = nib.load(file_path)
            
            # Inspect affine and shape
            affine = img.affine  # type: ignore
            shape = img.shape  # type: ignore
            
            # NiBabel images can be proxy, we get the data array
            data = img.get_fdata(dtype=np.float32)  # type: ignore
            
            # Validate shape (e.g. max 4D)
            if len(shape) > 4:
                raise ValueError(f"Unsupported NIfTI shape with {len(shape)} dimensions")
                
            # Check for NaN / Inf
            if not np.isfinite(data).all():
                logger.warning("NIfTI data contains NaN or Inf values")
                # In a real pipeline, we might sanitize or reject
                data = np.nan_to_num(data)
                
            header = img.header
            zooms = header.get_zooms()  # type: ignore
            
            # Origin is typically the translation part of the affine
            origin = (float(affine[0, 3]), float(affine[1, 3]), float(affine[2, 3]))
            
            # Orientation codes
            ornt = nib.io_orientation(affine)
            ornt_str = "".join(nib.orientations.ornt2axcodes(ornt))
            
            # We just produce the canonical representation here
            canonical = CanonicalMedicalImage(
                study_id=study_id,
                series_id=series_id,
                source_format="NIFTI",
                modality="UNKNOWN", # Cannot reliably determine from pure NIfTI without context
                shape=shape,
                spacing=tuple(float(z) for z in zooms[:3]),
                origin=origin,
                direction_matrix=(1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0), # Simplified for now, should be derived from affine
                affine=tuple(tuple(float(v) for v in row) for row in affine),
                canonical_orientation=ornt_str,
                data_type=str(data.dtype),
                source_checksum="TODO_MD5",
                processing_history=[{"action": "ingest_nifti", "version": "1.0.0"}],
                transform_to_source={"original_affine": affine.tolist()}
            )
            
            return canonical
            
        except Exception as e:
            logger.error("Failed to ingest NIfTI file", error=str(e))
            raise ValueError(f"Invalid NIfTI file: {e}")
