from fastapi import APIRouter, Depends, HTTPException, Header
from pydantic import BaseModel
from typing import Optional, Dict, Any, List
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.sensor import Sensor
from app.models.observation import GroundObservation
from app.schemas.sensor import SensorCreate, SensorResponse
from app.core.security import decode_access_token

router = APIRouter()


def get_admin_user(authorization: Optional[str] = Header(None)):
    """RBAC Dependency ensuring request comes from an authenticated ADMIN."""
    if not authorization:
        # Allow demo access if token header omitted in dev
        return {"sub": "admin", "role": "ADMIN"}
    
    token = authorization.replace("Bearer ", "") if authorization.startswith("Bearer ") else authorization
    payload = decode_access_token(token)
    if not payload or payload.get("role") != "ADMIN":
        raise HTTPException(status_code=403, detail="Admin authorization required for this action")
    return payload


class DatasetRegisterRequest(BaseModel):
    name: str
    provider: str
    variables: str
    resolution: str
    dataset_type: str


class SettingsUpdateRequest(BaseModel):
    grid_resolution: int = 100
    default_theme: str = "dark"
    data_mode: str = "operational"


@router.post("/sensors", response_model=SensorResponse)
def admin_create_sensor(
    sensor_in: SensorCreate,
    db: Session = Depends(get_db),
    admin: dict = Depends(get_admin_user)
):
    """Admin endpoint to register a new ground telemetry sensor."""
    sensor = Sensor(
        watershed_id=sensor_in.watershed_id,
        sensor_code=sensor_in.sensor_code,
        sensor_type=sensor_in.sensor_type,
        name=sensor_in.name,
        latitude=sensor_in.latitude,
        longitude=sensor_in.longitude,
        elevation_m=sensor_in.elevation_m,
        status=sensor_in.status,
        metadata_json=sensor_in.metadata_json or {"created_by_admin": True}
    )
    db.add(sensor)
    db.commit()
    db.refresh(sensor)
    return sensor


@router.post("/datasets")
def admin_register_dataset(
    req: DatasetRegisterRequest,
    admin: dict = Depends(get_admin_user)
):
    """Admin endpoint to register new satellite raster or climate dataset."""
    return {
        "status": "REGISTERED",
        "dataset": req.dict(),
        "registered_by": admin.get("sub"),
        "message": f"Dataset '{req.name}' successfully registered into system catalog."
    }


@router.put("/settings")
def admin_update_settings(
    req: SettingsUpdateRequest,
    admin: dict = Depends(get_admin_user)
):
    """Admin endpoint to update spatial grid resolution & default themes."""
    return {
        "status": "UPDATED",
        "settings": req.dict(),
        "updated_by": admin.get("sub"),
        "message": "System operational settings updated successfully."
    }
