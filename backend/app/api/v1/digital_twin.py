from fastapi import APIRouter
from app.services.digital_twin.twin_service import DigitalTwinService

router = APIRouter()


@router.get("/{watershed_id}")
def get_digital_twin_state(watershed_id: int):
    return DigitalTwinService.get_digital_twin_state(watershed_id)
