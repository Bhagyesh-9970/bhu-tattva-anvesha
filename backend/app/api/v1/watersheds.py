from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.watershed import Watershed
from app.schemas.watershed import WatershedResponse
from app.services.mock_data_generator import get_demo_watershed_data

router = APIRouter()


@router.get("", response_model=List[WatershedResponse])
def list_watersheds(db: Session = Depends(get_db)):
    watersheds = db.query(Watershed).all()
    if not watersheds:
        # Fallback to mock data if database not yet seeded
        demo_dict = get_demo_watershed_data()
        return [
            WatershedResponse(
                id=1,
                created_at="2026-09-28T00:00:00",
                updated_at="2026-09-28T00:00:00",
                **demo_dict
            )
        ]
    return watersheds


@router.get("/{watershed_id}", response_model=WatershedResponse)
def get_watershed(watershed_id: int, db: Session = Depends(get_db)):
    watershed = db.query(Watershed).filter(Watershed.id == watershed_id).first()
    if not watershed:
        if watershed_id == 1:
            demo_dict = get_demo_watershed_data()
            return WatershedResponse(
                id=1,
                created_at="2026-09-28T00:00:00",
                updated_at="2026-09-28T00:00:00",
                **demo_dict
            )
        raise HTTPException(status_code=404, detail="Watershed not found")
    return watershed
