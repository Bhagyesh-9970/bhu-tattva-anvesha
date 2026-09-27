from typing import Dict, Any
from app.services.digital_twin.twin_service import DigitalTwinService


class ScenarioEngine:
    """What-If Simulation Engine for Climate & Environmental Perturbation Scenarios."""

    @staticmethod
    def run_scenario(
        watershed_id: int,
        rainfall_pct_change: float = 0.0,
        temp_c_change: float = 0.0,
        vegetation_pct_change: float = 0.0
    ) -> Dict[str, Any]:
        """
        Executes scenario simulation against baseline digital twin state.
        Produces baseline vs scenario delta state, risk indicators, and uncertainty metrics.
        """
        baseline = DigitalTwinService.get_digital_twin_state(watershed_id)

        # Baseline metrics
        base_sm = baseline["soil_state"]["topsoil_moisture_pct"]
        base_ndvi = baseline["vegetation_state"]["ndvi_mean"]
        base_temp = baseline["climate_state"]["air_temp_c"]
        base_precip = baseline["climate_state"]["precipitation_24h_mm"]

        # Perturbed scenario metrics calculation
        scen_temp = round(base_temp + temp_c_change, 1)
        scen_precip = round(max(0.0, base_precip * (1.0 + (rainfall_pct_change / 100.0))), 1)

        # Soil moisture response model simulation
        sm_delta = (scen_precip - base_precip) * 0.45 - (temp_c_change * 1.2)
        scen_sm = round(max(5.0, min(50.0, base_sm + sm_delta)), 1)

        # NDVI response model simulation
        ndvi_delta = (vegetation_pct_change / 100.0) * 0.5 + (sm_delta / 100.0) * 0.4
        scen_ndvi = round(max(0.05, min(0.95, base_ndvi + ndvi_delta)), 3)

        # Risk indicator evaluation
        drought_risk = "HIGH" if scen_sm < 18.0 else ("MODERATE" if scen_sm < 25.0 else "LOW")
        vegetation_stress = "CRITICAL" if scen_ndvi < 0.35 else ("MODERATE" if scen_ndvi < 0.55 else "HEALTHY")

        return {
            "scenario_metadata": {
                "watershed_id": watershed_id,
                "parameters": {
                    "rainfall_pct_change": rainfall_pct_change,
                    "temp_c_change": temp_c_change,
                    "vegetation_pct_change": vegetation_pct_change
                },
                "simulation_estimate": True,
                "synthetic_demo_data": True
            },
            "baseline": {
                "soil_moisture_pct": base_sm,
                "ndvi": base_ndvi,
                "temperature_c": base_temp,
                "precipitation_mm": base_precip,
            },
            "scenario": {
                "soil_moisture_pct": scen_sm,
                "ndvi": scen_ndvi,
                "temperature_c": scen_temp,
                "precipitation_mm": scen_precip,
            },
            "deltas": {
                "soil_moisture_diff": round(scen_sm - base_sm, 1),
                "ndvi_diff": round(scen_ndvi - base_ndvi, 3),
                "temperature_diff": round(temp_c_change, 1),
                "precipitation_diff": round(scen_precip - base_precip, 1),
            },
            "risk_assessment": {
                "drought_risk_level": drought_risk,
                "vegetation_stress_level": vegetation_stress,
                "prototype_indicator_note": "Prototype environmental indicator simulation"
            },
            "uncertainty": {
                "scenario_uncertainty_score": 0.18,
                "confidence_score": 0.82
            }
        }
