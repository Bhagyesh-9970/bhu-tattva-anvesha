from fastapi import APIRouter
from app.api.v1.health import router as health_router
from app.api.v1.watersheds import router as watersheds_router
from app.api.v1.sensors import router as sensors_router
from app.api.v1.observations import router as observations_router
from app.api.v1.environmental_states import router as env_states_router
from app.api.v1.fusion import router as fusion_router
from app.api.v1.digital_twin import router as digital_twin_router
from app.api.v1.scenarios import router as scenarios_router
from app.api.v1.knowledge_graph import router as kg_router
from app.api.v1.rag import router as rag_router
from app.api.v1.auth import router as auth_router
from app.api.v1.admin import router as admin_router

api_router = APIRouter()

api_router.include_router(health_router, prefix="", tags=["Health"])
api_router.include_router(auth_router, prefix="/auth", tags=["Authentication"])
api_router.include_router(admin_router, prefix="/admin", tags=["Admin Portal"])
api_router.include_router(watersheds_router, prefix="/watersheds", tags=["Watersheds"])
api_router.include_router(sensors_router, prefix="/sensors", tags=["Sensors"])
api_router.include_router(observations_router, prefix="/observations", tags=["Observations"])
api_router.include_router(env_states_router, prefix="/environmental-state", tags=["Environmental State"])
api_router.include_router(fusion_router, prefix="/fusion", tags=["Sensor Fusion"])
api_router.include_router(digital_twin_router, prefix="/digital-twin", tags=["Digital Twin"])
api_router.include_router(scenarios_router, prefix="/scenarios", tags=["Scenarios"])
api_router.include_router(kg_router, prefix="/knowledge-graph", tags=["Knowledge Graph"])
api_router.include_router(rag_router, prefix="/rag", tags=["RAG Assistant"])
