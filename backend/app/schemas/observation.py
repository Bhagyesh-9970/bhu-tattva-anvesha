from datetime import datetime
from typing import Any, Dict, Optional
from pydantic import BaseModel, Field


class GroundObservationBase(BaseModel):
    variable_name: str
    value: float
    unit: str
    quality_flag: str = "GOOD"
    confidence_score: float = 1.0
    metadata_json: Optional[Dict[str, Any]] = Field(default_factory=dict)


class GroundObservationCreate(GroundObservationBase):
    sensor_id: int
    timestamp: datetime


class GroundObservationResponse(GroundObservationBase):
    id: int
    sensor_id: int
    timestamp: datetime

    class Config:
        from_attributes = True
