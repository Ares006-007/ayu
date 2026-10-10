import tempfile
from pathlib import Path

import pytest
from pydicom.dataset import FileDataset, FileMetaDataset
from pydicom.uid import ImplicitVRLittleEndian, generate_uid

from ayu_imaging.ingestion.dicom_reader import DicomIngestionService


def create_synthetic_dicom(path: Path, patient_id: str, study_uid: str, series_uid: str, sop_uid: str, instance_number: int, z_pos: float) -> None:
    file_meta = FileMetaDataset()
    file_meta.MediaStorageSOPClassUID = '1.2.840.10008.5.1.4.1.1.2' # type: ignore[assignment]
    file_meta.MediaStorageSOPInstanceUID = str(sop_uid) # type: ignore[assignment]
    file_meta.ImplementationClassUID = "1.2.3.4" # type: ignore[assignment]
    file_meta.TransferSyntaxUID = str(ImplicitVRLittleEndian) # type: ignore[assignment]

    ds = FileDataset(str(path), {}, file_meta=file_meta, preamble=b"\0" * 128)
    ds.PatientID = patient_id
    ds.StudyInstanceUID = study_uid
    ds.SeriesInstanceUID = series_uid
    ds.SOPInstanceUID = sop_uid
    ds.InstanceNumber = instance_number
    ds.ImagePositionPatient = [0.0, 0.0, z_pos]
    ds.ImageOrientationPatient = [1.0, 0.0, 0.0, 0.0, 1.0, 0.0]
    
    ds.is_little_endian = True
    ds.is_implicit_VR = True
    ds.save_as(path)

@pytest.fixture
def synthetic_dicom_dir(): # type: ignore
    with tempfile.TemporaryDirectory() as tmpdir:
        dir_path = Path(tmpdir)
        patient_id = "PAT001"
        study_uid = generate_uid()
        series_uid = generate_uid()
        
        # Create 3 slices
        for i in range(3):
            create_synthetic_dicom(
                dir_path / f"slice_{i}.dcm",
                patient_id, study_uid, series_uid,
                generate_uid(), i+1, i * 2.5
            )
            
        yield dir_path

def test_dicom_ingestion_valid_series(synthetic_dicom_dir: Path) -> None:
    service = DicomIngestionService()
    groups = service.ingest_directory(synthetic_dicom_dir)
    
    assert len(groups) == 1
    group = list(groups.values())[0]
    
    assert len(group.instances) == 3
    assert group.patient_id == "PAT001"

def test_dicom_ingestion_duplicate_sop(synthetic_dicom_dir: Path) -> None:
    service = DicomIngestionService()
    # duplicate the first file
    slice_0 = synthetic_dicom_dir / "slice_0.dcm"
    import shutil
    shutil.copy(slice_0, synthetic_dicom_dir / "duplicate.dcm")
    
    groups = service.ingest_directory(synthetic_dicom_dir)
    
    assert len(groups) == 1
    group = list(groups.values())[0]
    
    # Still 3 instances because the duplicate SOP UID was rejected
    assert len(group.instances) == 3

def test_dicom_ingestion_mixed_patient(synthetic_dicom_dir: Path) -> None:
    service = DicomIngestionService()
    
    # Add a file with a different patient ID
    create_synthetic_dicom(
        synthetic_dicom_dir / "other_patient.dcm",
        "PAT002", generate_uid(), generate_uid(),
        generate_uid(), 1, 0.0
    )
    
    with pytest.raises(ValueError, match="Unexpected mixed-patient upload detected"):
        service.ingest_directory(synthetic_dicom_dir)
