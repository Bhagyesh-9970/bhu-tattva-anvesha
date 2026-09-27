from datetime import datetime
from fastapi import APIRouter
from app.core.config import settings
from app.core.database import check_db_connection
from app.schemas.health import HealthResponse, DatabaseHealthResponse

router = APIRouter()


@router.get("/health", response_model=HealthResponse)
def get_health():
    return HealthResponse(
        status="healthy",
        project_name=settings.PROJECT_NAME,
        app_mode=settings.APP_MODE,
        data_mode=settings.DATA_MODE,
        grid_resolution=settings.GRID_RESOLUTION,
        timestamp=datetime.utcnow(),
    )


@router.get("/health/db", response_model=DatabaseHealthResponse)
def get_db_health():
    db_info = check_db_connection()
    return DatabaseHealthResponse(**db_info)
