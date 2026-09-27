from datetime import datetime
from typing import Any, Dict, Optional
from pydantic import BaseModel, Field


class WatershedBase(BaseModel):
    name: str
    code: str
    area_sqkm: float
    centroid_lat: float
    centroid_lon: float
    boundary_geojson: Dict[str, Any]
    description: Optional[str] = None
    metadata_json: Optional[Dict[str, Any]] = Field(default_factory=dict)


class WatershedCreate(WatershedBase):
    pass


class WatershedResponse(WatershedBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
