import math
import random
from datetime import datetime, timedelta
from typing import List, Dict, Any

KABINI_WATERSHED_GEOJSON = {
    "type": "Polygon",
    "coordinates": [[
        [75.95, 11.80],
        [76.10, 11.72],
        [76.35, 11.75],
        [76.45, 11.95],
        [76.30, 12.15],
        [76.05, 12.10],
        [75.95, 11.80]
    ]]
}


def get_demo_watershed_data() -> Dict[str, Any]:
    return {
        "name": "Kabini River Sub-basin (Upper Cauvery)",
        "code": "KABINI-SUBBASIN-01",
        "area_sqkm": 2140.5,
        "centroid_lat": 11.92,
        "centroid_lon": 76.25,
        "boundary_geojson": KABINI_WATERSHED_GEOJSON,
        "description": "Pilot watershed in the Western Ghats / Mysore plateau region featuring agro-forestry, seasonal agriculture, reservoir hydrology, and complex red/black soil dynamics.",
        "metadata_json": {
            "synthetic_demo_data": True,
            "crs": "EPSG:4326",
            "grid_resolution_m": 100,
            "region": "Karnataka/Kerala Border, India"
        }
    }


def get_demo_sensors_data(watershed_id: int) -> List[Dict[str, Any]]:
    return [
        {
            "watershed_id": watershed_id,
            "sensor_code": "KAB-SOIL-01",
            "sensor_type": "SOIL_MOISTURE",
            "name": "HD Kote Agro-Forestry Soil Station",
            "latitude": 11.88,
            "longitude": 76.15,
            "elevation_m": 720.0,
            "status": "ACTIVE",
            "metadata_json": {"synthetic_demo_data": True, "depth_cm": [10, 30, 60]}
        },
        {
            "watershed_id": watershed_id,
            "sensor_code": "KAB-SOIL-02",
            "sensor_type": "SOIL_MOISTURE",
            "name": "Kabini Shoreline Soil Station",
            "latitude": 11.95,
            "longitude": 76.28,
            "elevation_m": 695.0,
            "status": "ACTIVE",
            "metadata_json": {"synthetic_demo_data": True, "depth_cm": [10, 30]}
        },
        {
            "watershed_id": watershed_id,
            "sensor_code": "KAB-WX-01",
            "sensor_type": "WEATHER",
            "name": "Bavali Ghat AWS",
            "latitude": 11.82,
            "longitude": 76.02,
            "elevation_m": 850.0,
            "status": "ACTIVE",
            "metadata_json": {"synthetic_demo_data": True, "anemometer_height_m": 10}
        },
        {
            "watershed_id": watershed_id,
            "sensor_code": "KAB-WX-02",
            "sensor_type": "WEATHER",
            "name": "Nanjangud Valley AWS",
            "latitude": 12.05,
            "longitude": 76.38,
            "elevation_m": 660.0,
            "status": "ACTIVE",
            "metadata_json": {"synthetic_demo_data": True, "anemometer_height_m": 10}
        },
        {
            "watershed_id": watershed_id,
            "sensor_code": "KAB-WTR-01",
            "sensor_type": "WATER_LEVEL",
            "name": "Kabini Reservoir Hydro Station",
            "latitude": 11.90,
            "longitude": 76.25,
            "elevation_m": 690.0,
            "status": "ACTIVE",
            "metadata_json": {"synthetic_demo_data": True, "sensor_model": "Radar Level Meter RX-40"}
        },
    ]


def generate_synthetic_time_series(days: int = 30) -> List[Dict[str, Any]]:
    """Generates daily fused environmental states over `days` period."""
    end_date = datetime.utcnow()
    states = []
    
    for i in range(days):
        dt = end_date - timedelta(days=days - 1 - i)
        day_of_year = dt.timetuple().tm_yday
        
        # Seasonal sinusoidal base values
        temp = 26.5 + 4.0 * math.sin((day_of_year - 80) * 2 * math.pi / 365) + random.uniform(-1.0, 1.0)
        precip = max(0.0, 8.0 * math.sin((day_of_year - 150) * 2 * math.pi / 365) + random.uniform(-5.0, 15.0)) if random.random() > 0.4 else 0.0
        soil_m = max(10.0, min(45.0, 22.0 + precip * 0.8 - (temp - 25.0) * 0.4 + random.uniform(-2.0, 2.0)))
        ndvi = max(0.2, min(0.88, 0.45 + (soil_m / 100.0) * 0.6 + random.uniform(-0.03, 0.03)))
        evi = ndvi * 0.78
        ndwi = max(-0.4, min(0.5, (soil_m - 25.0) / 50.0 + random.uniform(-0.05, 0.05)))
        
        confidence = round(random.uniform(0.82, 0.96), 3)
        uncertainty = round(1.0 - confidence + random.uniform(0.01, 0.04), 3)
        
        states.append({
            "timestamp": dt,
            "soil_moisture": round(soil_m, 2),
            "soil_ph": round(6.5 + random.uniform(-0.3, 0.3), 2),
            "soil_organic_carbon": round(14.2 + random.uniform(-1.0, 1.0), 2),
            "ndvi": round(ndvi, 3),
            "evi": round(evi, 3),
            "ndwi": round(ndwi, 3),
            "water_body_index": round(max(0.0, ndwi), 3),
            "precipitation_mm": round(precip, 1),
            "temperature_c": round(temp, 1),
            "humidity_pct": round(max(30.0, min(95.0, 60.0 + precip * 1.5 - temp * 0.5 + random.uniform(-5.0, 5.0))), 1),
            "wind_speed_ms": round(max(0.5, 3.2 + random.uniform(-1.2, 2.1)), 1),
            "vegetation_health_index": round(ndvi * 100.0, 1),
            "overall_confidence": confidence,
            "uncertainty_score": uncertainty,
            "provenance": {
                "synthetic_demo_data": True,
                "fusion_method": "WeightedAverageFusion",
                "contributing_sources": ["Sentinel-1", "Sentinel-2", "ERA5", "GroundSensors"],
                "processing_timestamp": datetime.utcnow().isoformat(),
                "resolution_m": 100
            }
        })
        
    return states
