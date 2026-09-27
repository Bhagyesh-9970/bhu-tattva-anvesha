from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
from app.services.fusion.fusion_engine import FusionEngine

router = APIRouter()


class FusionRequest(BaseModel):
    s1_val: Optional[float] = 26.5
    s2_val: Optional[float] = 29.1
    smap_val: Optional[float] = 27.8
    ground_val: Optional[float] = 28.4


@router.post("/run")
def run_fusion(req: FusionRequest):
    stage_a = FusionEngine.run_stage_a_single_source(req.s1_val, req.s2_val, req.smap_val, req.ground_val)
    stage_b = FusionEngine.run_stage_b_simple_average(req.s1_val, req.s2_val, req.smap_val, req.ground_val)
    stage_c = FusionEngine.run_stage_c_weighted_average(req.s1_val, req.s2_val, req.smap_val, req.ground_val)
    stage_d = FusionEngine.run_stage_d_ml_baseline(req.s1_val, req.s2_val, req.smap_val, req.ground_val)
    stage_e = FusionEngine.run_stage_e_confidence_aware_fusion(req.s1_val, req.s2_val, req.smap_val, req.ground_val)

    return {
        "stage_a_single_source": stage_a,
        "stage_b_simple_average": stage_b,
        "stage_c_weighted_average": stage_c,
        "stage_d_ml_baseline": stage_d,
        "stage_e_confidence_aware": stage_e,
    }
