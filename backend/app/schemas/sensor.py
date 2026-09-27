from datetime import datetime
from typing import Any, Dict, Optional
from pydantic import BaseModel, Field


class SensorBase(BaseModel):
    sensor_code: str
    sensor_type: str
    name: str
    latitude: float
    longitude: float
    elevation_m: Optional[float] = None
    status: str = "ACTIVE"
    metadata_json: Optional[Dict[str, Any]] = Field(default_factory=dict)


class SensorCreate(SensorBase):
    watershed_id: int


class SensorResponse(SensorBase):
    id: int
    watershed_id: int
    installation_date: datetime

    class Config:
        from_attributes = True
