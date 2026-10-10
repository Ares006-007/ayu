import os
from pathlib import Path

import pydicom
import structlog
from pydicom.errors import InvalidDicomError

from ..domain.models import QualityFlag, QualityResult

logger = structlog.get_logger(__name__)

class DicomSeriesGroup:
    def __init__(self, patient_id: str, study_uid: str, series_uid: str) -> None:
        self.patient_id = patient_id
        self.study_uid = study_uid
        self.series_uid = series_uid
        self.instances: list[pydicom.FileDataset] = []
        self.paths: list[Path] = []
        
    def add_instance(self, path: Path, ds: pydicom.FileDataset) -> None:
        self.instances.append(ds)
        self.paths.append(path)

class DicomIngestionService:
    def __init__(self) -> None:
        pass

    def ingest_directory(self, dir_path: Path) -> dict[str, DicomSeriesGroup]:
        """
        Parses all DICOM files in a directory safely without loading full pixel data initially.
        Groups them by PatientID -> StudyUID -> SeriesUID.
        """
        groups: dict[str, DicomSeriesGroup] = {}
        expected_patient_id = None
        
        for root, _, files in os.walk(dir_path):
            for file in files:
                file_path = Path(root) / file
                
                try:
                    # Read metadata without pixel data to save memory
                    ds = pydicom.dcmread(file_path, stop_before_pixels=True)
                    
                    patient_id = str(getattr(ds, "PatientID", "UNKNOWN"))
                    study_uid = str(getattr(ds, "StudyInstanceUID", "UNKNOWN"))
                    series_uid = str(getattr(ds, "SeriesInstanceUID", "UNKNOWN"))
                    
                    if expected_patient_id is None:
                        expected_patient_id = patient_id
                    elif patient_id != expected_patient_id and patient_id != "UNKNOWN":
                        logger.error("Mixed patient upload detected", expected=expected_patient_id, found=patient_id)
                        raise ValueError("Unexpected mixed-patient upload detected in the same ingestion batch.")
                    
                    group_key = f"{patient_id}::{study_uid}::{series_uid}"
                    if group_key not in groups:
                        groups[group_key] = DicomSeriesGroup(patient_id, study_uid, series_uid)
                        
                    # Check for duplicate SOP Instance UID
                    sop_uid = str(getattr(ds, "SOPInstanceUID", "UNKNOWN"))
                    if any(getattr(existing, "SOPInstanceUID", "") == sop_uid for existing in groups[group_key].instances):
                        logger.warning("Duplicate SOP Instance UID detected", sop_uid=sop_uid)
                        continue # Skip duplicate
                        
                    groups[group_key].add_instance(file_path, ds)
                    
                except InvalidDicomError:
                    logger.debug("Skipping non-DICOM file", path=str(file_path))
                except ValueError:
                    # Propagate our own intentional errors
                    raise
                except Exception as e:
                    logger.error("Error reading DICOM file", path=str(file_path), error=str(e))
                    
        return groups
    
    def validate_series(self, group: DicomSeriesGroup) -> QualityResult:
        """
        Validates spatial metadata and orientation.
        """
        flags: list[QualityFlag] = []
        usable = True
        level = "ADEQUATE"
        
        if not group.instances:
            return QualityResult(usable=False, level="UNUSABLE", flags=[QualityFlag(code="EMPTY_SERIES", severity="ERROR", message="No instances found")])
            
        # Check orientation consistency
        first_orientation = getattr(group.instances[0], "ImageOrientationPatient", None)
        for ds in group.instances[1:]:
            orientation = getattr(ds, "ImageOrientationPatient", None)
            if orientation != first_orientation:
                flags.append(QualityFlag(code="INCONSISTENT_ORIENTATION", severity="WARNING", message="Slices have inconsistent orientation vectors"))
                break
                
        # Slice ordering by ImagePositionPatient
        try:
            # We sort by the projection of ImagePositionPatient onto the normal vector
            normal = None
            if first_orientation and len(first_orientation) == 6:
                row_cosine = [float(x) for x in first_orientation[:3]]
                col_cosine = [float(x) for x in first_orientation[3:]]
                normal = [
                    row_cosine[1] * col_cosine[2] - row_cosine[2] * col_cosine[1],
                    row_cosine[2] * col_cosine[0] - row_cosine[0] * col_cosine[2],
                    row_cosine[0] * col_cosine[1] - row_cosine[1] * col_cosine[0]
                ]
            
            if normal:
                def get_slice_pos(ds: pydicom.FileDataset) -> float:
                    pos = getattr(ds, "ImagePositionPatient", [0, 0, 0])
                    return sum(float(p) * n for p, n in zip(pos, normal))
                    
                group.instances.sort(key=get_slice_pos)
            else:
                flags.append(QualityFlag(code="MISSING_SPATIAL_INFO", severity="WARNING", message="Missing spatial position/orientation, cannot reliably order slices"))
        except Exception as e:
            logger.warning("Error sorting slices", error=str(e))
            flags.append(QualityFlag(code="SLICE_SORT_ERROR", severity="WARNING", message="Failed to spatially order slices"))

        from typing import Literal
        level_value: Literal["ADEQUATE", "MARGINAL", "UNUSABLE"] = "MARGINAL" if len(flags) > 0 else "ADEQUATE"
            
        return QualityResult(usable=usable, level=level_value, flags=flags)
