from datetime import datetime
from typing import Any, Dict, Optional
from pydantic import BaseModel, Field


class EnvironmentalStateBase(BaseModel):
    soil_moisture: Optional[float] = None
    soil_ph: Optional[float] = None
    soil_organic_carbon: Optional[float] = None
    ndvi: Optional[float] = None
    evi: Optional[float] = None
    ndwi: Optional[float] = None
    water_body_index: Optional[float] = None
    precipitation_mm: Optional[float] = None
    temperature_c: Optional[float] = None
    humidity_pct: Optional[float] = None
    wind_speed_ms: Optional[float] = None
    vegetation_health_index: Optional[float] = None
    overall_confidence: float = 0.85
    uncertainty_score: float = 0.15
    provenance: Dict[str, Any] = Field(default_factory=dict)


class EnvironmentalStateCreate(EnvironmentalStateBase):
    watershed_id: int
    timestamp: datetime


class EnvironmentalStateResponse(EnvironmentalStateBase):
    id: int
    watershed_id: int
    timestamp: datetime

    class Config:
        from_attributes = True
