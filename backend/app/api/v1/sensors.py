from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.sensor import Sensor
from app.schemas.sensor import SensorResponse
from app.services.mock_data_generator import get_demo_sensors_data

router = APIRouter()


@router.get("", response_model=List[SensorResponse])
def list_sensors(
    watershed_id: Optional[int] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(Sensor)
    if watershed_id is not None:
        query = query.filter(Sensor.watershed_id == watershed_id)
    sensors = query.all()
    if not sensors:
        # Fallback to mock sensors if not yet seeded
        demo_sensors = get_demo_sensors_data(watershed_id or 1)
        res = []
        for idx, s in enumerate(demo_sensors, 1):
            res.append(
                SensorResponse(
                    id=idx,
                    installation_date="2026-01-01T00:00:00",
                    **s
                )
            )
        return res
    return sensors


@router.get("/{sensor_id}", response_model=SensorResponse)
def get_sensor(sensor_id: int, db: Session = Depends(get_db)):
    sensor = db.query(Sensor).filter(Sensor.id == sensor_id).first()
    if not sensor:
        demo_sensors = get_demo_sensors_data(1)
        if 1 <= sensor_id <= len(demo_sensors):
            return SensorResponse(
                id=sensor_id,
                installation_date="2026-01-01T00:00:00",
                **demo_sensors[sensor_id - 1]
            )
        raise HTTPException(status_code=404, detail="Sensor not found")
    return sensor
