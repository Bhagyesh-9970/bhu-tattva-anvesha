from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.environmental_state import EnvironmentalState
from app.schemas.environmental_state import EnvironmentalStateResponse
from app.services.mock_data_generator import generate_synthetic_time_series

router = APIRouter()


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
        # Fallback to generated synthetic time-series
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
