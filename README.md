# BHŪ-TATTVA-ANVEṢA (भू-तत्त्व-अन्वेष)

**An Intelligent 3D Soil and Environmental Nexus System: Integrating Digital Twins, Confidence-Aware Sensor Fusion, and Knowledge-Graph-Driven Decision Support for the Land–Water–Climate Continuum**

---

## Overview

BHŪ-TATTVA-ANVEṢA is a state-of-the-art environmental intelligence platform integrating multi-source satellite Earth observation data (Sentinel-1, Sentinel-2, ERA5, SoilGrids, SMAP), ground-based environmental observations, confidence-aware multi-sensor fusion, an environmental digital twin, a knowledge graph, and retrieval-augmented generation (RAG) for natural language decision support.

---

## Operational System Architecture

```
[ Frontend: React + TypeScript + Vite + Tailwind + Leaflet + Three.js 3D ]
                                  │  (HTTP / JSON API)
                                  ▼
                     [ Backend: FastAPI (Python 3.12+) ]
                     ├── Watershed & Sensor Management
                     ├── Confidence-Aware Sensor Fusion Engine
                     ├── What-If Climate Scenario Engine
                     ├── Neo4j Knowledge Graph Service
                     └── Evidence-Grounded RAG Assistant
                                  │
                  ┌───────────────┴───────────────┐
                  ▼                               ▼
         [ PostgreSQL 16 + PostGIS ]     [ Neo4j Graph DB 5.x ]
```

---

## Key Features

1. **High-Resolution Satellite & GIS Basemaps**: Esri World Imagery (sub-meter resolution, no API key required), OpenTopoMap topographic layers, and CartoDB Dark GIS basemaps.
2. **ISRO Bhuvan Spatial Tools**: Real-time cursor Lat/Lon telemetry, distance & area measurement tool, and layer opacity drawer.
3. **Interactive 3D Digital Twin**: Three.js procedural 3D terrain canvas with satellite texture mapping, height displacement, and 6-layer switching (*Elevation, Vegetation, Soil, Water, Climate, Confidence*).
4. **5-Stage Sensor Fusion Engine**: Single-source baseline, simple average, inverse-variance weighted, Random Forest ML, and Stage E Confidence-Aware Fusion with 95% prediction interval uncertainty bounds.
5. **What-If Scenario Simulator**: Interactive parameter sliders for rainfall, temperature, and vegetation perturbations with live delta computation and drought risk alerts.
6. **Neo4j Knowledge Graph**: Node-link SVG physics graph visualizer, entity property inspector, and Cypher console.
7. **Grounded RAG Assistant**: Natural language Q&A with evidence cards, confidence pills, and grounded source citations.

---

## Quick Start (Run Locally)

### 1. Backend Server
```bash
cd backend
python -m pip install -r requirements.txt
python scripts/seed_demo_data.py
uvicorn app.main:app --reload --port 8000
```
- API Endpoint: `http://localhost:8000`
- Interactive OpenAPI Docs: `http://localhost:8000/docs`

### 2. Frontend Application
```bash
cd frontend
npm install
npm run dev
```
- Web Application: `http://localhost:5173`

---

## Verification & Automated Tests

To run the backend test suite:
```bash
cd backend
pytest tests/ -v
```
