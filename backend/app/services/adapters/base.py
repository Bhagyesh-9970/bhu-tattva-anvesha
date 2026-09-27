from abc import ABC, abstractmethod
from typing import Dict, Any, List, Optional
from datetime import datetime


class DatasetAdapter(ABC):
    """Abstract Base Class for Earth Observation and Ground Sensor Dataset Adapters."""

    def __init__(self, dataset_name: str, provider: str):
        self.dataset_name = dataset_name
        self.provider = provider

    @abstractmethod
    def search(self, bbox: List[float], start_date: datetime, end_date: datetime) -> List[Dict[str, Any]]:
        """Search available scenes or data assets within bounding box and temporal range."""
        pass

    @abstractmethod
    def download(self, asset_id: str, output_path: str) -> bool:
        """Download scene file to output path."""
        pass

    @abstractmethod
    def validate(self, data_payload: Dict[str, Any]) -> bool:
        """Validate payload integrity, schema, and quality flags."""
        pass

    @abstractmethod
    def preprocess(self, data_payload: Dict[str, Any]) -> Dict[str, Any]:
        """Perform cloud masking, noise reduction, and outlier filtering."""
        pass

    @abstractmethod
    def transform(self, data_payload: Dict[str, Any], target_crs: str = "EPSG:4326", target_resolution_m: int = 100) -> Dict[str, Any]:
        """Harmonize payload to common spatial grid resolution and CRS."""
        pass
