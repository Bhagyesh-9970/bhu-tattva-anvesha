from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.observation import GroundObservation
from app.schemas.observation import GroundObservationResponse

router = APIRouter()


@router.get("", response_model=List[GroundObservationResponse])
def list_observations(
    sensor_id: Optional[int] = Query(None),
    limit: int = Query(100, ge=1, le=1000),
    db: Session = Depends(get_db)
):
    query = db.query(GroundObservation)
    if sensor_id is not None:
        query = query.filter(GroundObservation.sensor_id == sensor_id)
    observations = query.order_by(GroundObservation.timestamp.desc()).limit(limit).all()
    return observations
