from typing import List, Optional, Dict, Any
from fastapi import APIRouter, Depends, Query
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.environmental_state import EnvironmentalState
from app.schemas.environmental_state import EnvironmentalStateResponse
from app.services.mock_data_generator import generate_synthetic_time_series
from app.services.spatial_area_service import query_land_area_metrics, KNOWN_ZONES

router = APIRouter()


class AreaQueryRequest(BaseModel):
    watershed_id: int = 1
    bbox: Optional[List[float]] = None  # [min_lon, min_lat, max_lon, max_lat]
    zone_id: Optional[str] = None
    days: int = 14


@router.get("", response_model=List[EnvironmentalStateResponse])
def get_environmental_state(
    watershed_id: Optional[int] = Query(None),
    days: int = Query(30, ge=1, le=365),
    db: Session = Depends(get_db)
):
    query = db.query(EnvironmentalState)
    if watershed_id is not None:
        query = query.filter(EnvironmentalState.watershed_id == watershed_id)
    states = query.order_by(EnvironmentalState.timestamp.desc()).limit(days).all()
    
    if not states:
        mock_series = generate_synthetic_time_series(days=days)
        res = []
        for idx, s in enumerate(mock_series, 1):
            res.append(
                EnvironmentalStateResponse(
                    id=idx,
                    watershed_id=watershed_id or 1,
                    **s
                )
            )
        return res
    return states


@router.post("/query-area")
def query_area_environmental_state(req: AreaQueryRequest):
    """
    Computes and returns localized environmental, soil, climate, and risk metrics
    for a user-selected land area (bounding box or predefined micro-zone).
    """
    return query_land_area_metrics(
        watershed_id=req.watershed_id,
        bbox=req.bbox,
        zone_id=req.zone_id,
        days=req.days
    )


@router.get("/zones")
def list_known_watershed_zones():
    """Returns available micro-catchment zones for quick selection."""
    return [
        {"id": k, "name": v["name"], "area_sqkm": v["area_sqkm"], "centroid": v["centroid"]}
        for k, v in KNOWN_ZONES.items()
    ]
