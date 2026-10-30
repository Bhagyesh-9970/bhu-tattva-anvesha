export interface Watershed {
  id: number;
  name: string;
  code: string;
  area_sqkm: number;
  centroid_lat: number;
  centroid_lon: number;
  boundary_geojson: {
    type: string;
    coordinates: number[][][];
  };
  description?: string;
  metadata_json?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface Sensor {
  id: number;
  watershed_id: number;
  sensor_code: string;
  sensor_type: 'SOIL_MOISTURE' | 'WEATHER' | 'WATER_LEVEL' | 'MULTI_PARAM';
  name: string;
  latitude: number;
  longitude: number;
  elevation_m?: number;
  status: 'ACTIVE' | 'INACTIVE';
  installation_date: string;
  metadata_json?: Record<string, any>;
}

export interface EnvironmentalState {
  id: number;
  watershed_id: number;
  timestamp: string;
  soil_moisture?: number;
  soil_ph?: number;
  soil_organic_carbon?: number;
  ndvi?: number;
  evi?: number;
  ndwi?: number;
  water_body_index?: number;
  precipitation_mm?: number;
  temperature_c?: number;
  humidity_pct?: number;
  wind_speed_ms?: number;
  vegetation_health_index?: number;
  overall_confidence: number;
  uncertainty_score: number;
  provenance: {
    synthetic_demo_data?: boolean;
    fusion_method?: string;
    contributing_sources?: string[];
    processing_timestamp?: string;
    resolution_m?: number;
    [key: string]: any;
  };
}

export interface HealthStatus {
  status: string;
  project_name: string;
  app_mode: string;
  data_mode: string;
  grid_resolution: number;
  timestamp: string;
}

export interface AreaTimeSeriesItem {
  timestamp: string;
  date: string;
  soil_moisture: number;
  ndvi: number;
  temperature_c: number;
  precipitation_mm: number;
  confidence: number;
}

export interface SelectedAreaMetrics {
  zone_id?: string;
  zone_name: string;
  area_sqkm: number;
  area_ha: number;
  bbox?: number[];
  center_lat: number;
  center_lon: number;
  soil_moisture: number;
  ndvi: number;
  evi: number;
  ndwi: number;
  temperature_c: number;
  precipitation_mm: number;
  soil_ph: number;
  soil_organic_carbon: number;
  sand_fraction_pct: number;
  clay_fraction_pct: number;
  active_sensors_count: number;
  overall_confidence: number;
  uncertainty_score: number;
  drought_risk: 'LOW' | 'MODERATE' | 'HIGH' | 'NONE';
  vegetation_stress: 'HEALTHY' | 'MODERATE' | 'CRITICAL' | 'STRESSED' | 'VIGOROUS' | 'EXCELLENT';
  land_cover_type: string;
  time_series: AreaTimeSeriesItem[];
  provenance: Record<string, any>;
}

export interface KnownZone {
  id: string;
  name: string;
  area_sqkm: number;
  centroid: [number, number];
}
