from fastapi import APIRouter
from pydantic import BaseModel
from app.services.scenarios.scenario_engine import ScenarioEngine

router = APIRouter()


class ScenarioRunRequest(BaseModel):
    watershed_id: int = 1
    rainfall_pct_change: float = -20.0
    temp_c_change: float = 2.0
    vegetation_pct_change: float = -10.0


@router.post("/run")
def run_scenario_simulation(req: ScenarioRunRequest):
    return ScenarioEngine.run_scenario(
        watershed_id=req.watershed_id,
        rainfall_pct_change=req.rainfall_pct_change,
        temp_c_change=req.temp_c_change,
        vegetation_pct_change=req.vegetation_pct_change,
    )
