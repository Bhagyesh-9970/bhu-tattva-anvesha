from app.services.fusion.fusion_engine import FusionEngine
from app.services.scenarios.scenario_engine import ScenarioEngine
from app.services.digital_twin.twin_service import DigitalTwinService
from app.services.knowledge_graph.graph_service import KnowledgeGraphService
from app.services.rag.assistant_service import RAGAssistantService


def test_fusion_stage_e():
    res = FusionEngine.run_stage_e_confidence_aware_fusion(26.5, 29.1, 27.8, 28.4)
    assert "fused_estimate" in res
    assert 0.0 <= res["overall_confidence"] <= 1.0
    assert "Sentinel-1 (SAR)" in res["sensor_contributions"]
    assert res["provenance"]["synthetic_demo_data"] is True


def test_scenario_engine():
    res = ScenarioEngine.run_scenario(watershed_id=1, rainfall_pct_change=-20.0, temp_c_change=2.0)
    assert res["baseline"]["soil_moisture_pct"] > 0
    assert res["scenario"]["soil_moisture_pct"] > 0
    assert res["risk_assessment"]["drought_risk_level"] in ["LOW", "MODERATE", "HIGH"]


def test_digital_twin_state():
    state = DigitalTwinService.get_digital_twin_state(watershed_id=1)
    assert "soil_state" in state
    assert "vegetation_state" in state
    assert "water_state" in state
    assert "climate_state" in state


def test_knowledge_graph_subgraph():
    kg = KnowledgeGraphService.get_subgraph("KABINI-SUBBASIN-01")
    assert len(kg["nodes"]) >= 5
    assert len(kg["edges"]) >= 5


def test_rag_assistant_grounded_answer():
    res1 = RAGAssistantService.process_query("What is the soil moisture?", watershed_id=1)
    assert "fused topsoil moisture" in res1["answer"]
    assert res1["confidence_score"] > 0

    res2 = RAGAssistantService.process_query("What is the capital of Mars?", watershed_id=1)
    assert "sufficient evidence" in res2["answer"]
    assert res2["confidence_score"] == 0.0
