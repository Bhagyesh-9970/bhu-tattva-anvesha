from app.services.fusion.fusion_engine import FusionEngine
from app.services.scenarios.scenario_engine import ScenarioEngine
from app.services.digital_twin.twin_service import DigitalTwinService
from app.services.knowledge_graph.graph_service import KnowledgeGraphService
from app.services.rag.assistant_service import RAGAssistantService
from app.services.spatial_area_service import query_land_area_metrics, calculate_area_from_bbox


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


def test_spatial_area_query():
    # Test zone query
    zone_res = query_land_area_metrics(watershed_id=1, zone_id="hd_kote_agroforestry")
    assert zone_res["area_sqkm"] == 420.0
    assert zone_res["soil_moisture"] > 0
    assert zone_res["ndvi"] > 0
    assert len(zone_res["time_series"]) == 14

    # Test custom bounding box
    bbox = [76.10, 11.80, 76.25, 11.95]
    bbox_res = query_land_area_metrics(watershed_id=1, bbox=bbox)
    assert bbox_res["area_sqkm"] > 0
    assert "Custom Parcel" in bbox_res["zone_name"]
    assert bbox_res["active_sensors_count"] >= 1

