# Database Schema — BHŪ-TATTVA-ANVEṢA

The primary relational storage uses PostgreSQL 16 with the PostGIS extension enabled (`CREATE EXTENSION IF NOT EXISTS postgis;`).

## Entity Models

### 1. `watersheds`
- `id`: Integer (Primary Key)
- `name`: String(100)
- `code`: String(50), Unique
- `area_sqkm`: Float
- `centroid_lat`: Float
- `centroid_lon`: Float
- `boundary_geojson`: JSONB / Geometry(POLYGON, 4326)
- `description`: Text
- `metadata_json`: JSONB
- `created_at`: DateTime (UTC)

### 2. `sensors`
- `id`: Integer (Primary Key)
- `watershed_id`: Integer (FK -> watersheds.id)
- `sensor_code`: String(50), Unique
- `sensor_type`: Enum (`SOIL_MOISTURE`, `WEATHER`, `WATER_LEVEL`, `MULTI_PARAM`)
- `name`: String(100)
- `latitude`: Float
- `longitude`: Float
- `elevation_m`: Float
- `status`: String (`ACTIVE`, `INACTIVE`)
- `installation_date`: DateTime
- `metadata_json`: JSONB

### 3. `ground_observations`
- `id`: Integer (Primary Key)
- `sensor_id`: Integer (FK -> sensors.id)
- `timestamp`: DateTime (Indexed)
- `variable_name`: String(50)
- `value`: Float
- `unit`: String(20)
- `quality_flag`: String(20)
- `confidence_score`: Float
- `metadata_json`: JSONB

### 4. `environmental_states`
- `id`: Integer (Primary Key)
- `watershed_id`: Integer (FK -> watersheds.id)
- `timestamp`: DateTime (Indexed)
- `soil_moisture`: Float
- `soil_ph`: Float
- `soil_organic_carbon`: Float
- `ndvi`: Float
- `evi`: Float
- `ndwi`: Float
- `precipitation_mm`: Float
- `temperature_c`: Float
- `humidity_pct`: Float
- `wind_speed_ms`: Float
- `vegetation_health_index`: Float
- `water_body_index`: Float
- `overall_confidence`: Float
- `uncertainty_score`: Float
- `provenance`: JSONB
