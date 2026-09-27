from datetime import datetime
from pydantic import BaseModel, Field


class HealthResponse(BaseModel):
    status: str = Field(..., example="healthy")
    project_name: str
    app_mode: str
    data_mode: str
    grid_resolution: int
    timestamp: datetime


class DatabaseHealthResponse(BaseModel):
    connected: bool
    database: str
    postgis_enabled: bool
    postgis_version: str | None = None
    error: str | None = None
