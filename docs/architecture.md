# System Architecture — BHŪ-TATTVA-ANVEṢA

```mermaid
graph TD
    A[Earth Observation Satellites<br/>Sentinel-1, Sentinel-2, ERA5, SoilGrids] -->|Ingestion| B[Dataset Adapters]
    C[Ground Observation Sensors] -->|Ingestion| B
    B --> D[Preprocessing & Common Spatial Grid]
    D --> E[Feature Engineering<br/>NDVI, NDWI, EVI, Backscatter]
    E --> F[Confidence-Aware Sensor Fusion]
    F --> G[Normalized Environmental State]
    G --> H[Environmental Digital Twin]
    G --> I[Neo4j Knowledge Graph]
    H & I --> J[RAG & Evidence Retrieval]
    J --> K[Natural Language Decision Support]
    G & H & K --> L[React 2D/3D Geospatial Dashboard]
```

## Architectural Principles
1. **Frontend Isolation**: Frontend accesses data strictly via FastAPI endpoints. Direct database calls from the frontend are prohibited.
2. **Explicit Data Provenance**: Every observation, derived feature, fused state, and simulation result carries source, timestamp, confidence, and quality flags.
3. **Data Distinction**: Clear separation between `OBSERVED_DATA`, `DERIVED_DATA`, `MODEL_ESTIMATE`, `SIMULATION`, and `SYNTHETIC_DEMO_DATA`.
