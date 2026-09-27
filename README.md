# BHŪ-TATTVA-ANVEṢA (भू-तत्त्व-अन्वेष)

**An Intelligent 3D Soil and Environmental Nexus System: Integrating Digital Twins, Confidence-Aware Sensor Fusion, and Knowledge-Graph-Driven Decision Support for the Land–Water–Climate Continuum**

---

## Overview

BHŪ-TATTVA-ANVEṢA is a research prototype designed to integrate multi-source satellite Earth observation data (Sentinel-1, Sentinel-2, ERA5, SoilGrids), ground-based environmental observations, confidence-aware sensor fusion, an environmental digital twin, a knowledge graph, and retrieval-augmented generation (RAG) for decision support.

---

## Phase 1 Architecture

```
[ Frontend: React + TypeScript + Vite + Tailwind + Leaflet ]
                          │  (HTTP / JSON API)
                          ▼
             [ Backend: FastAPI (Python 3.12+) ]
             ├── Watershed & Sensor Management
             ├── Environmental State & Feature Engine
             └── Mock Data Generator (Synthetic Provenance)
                          │
          ┌───────────────┴───────────────┐
          ▼                               ▼
 [ PostgreSQL 16 + PostGIS ]     [ Neo4j Graph DB 5.x ]
```

---

## Getting Started

### Prerequisites

- Python 3.12+
- Node.js 18+ / npm 9+
- Docker & Docker Compose (optional for containerized deployment)

### Environment Configuration

Copy the sample environment file:

```bash
cp .env.example .env
```

---

## Running Locally

### 1. Backend Setup

```bash
cd backend
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
python -m scripts.seed_demo_data
uvicorn app.main:app --reload --port 8000
```

Backend API will be accessible at: `http://localhost:8000`
OpenAPI Documentation: `http://localhost:8000/docs`

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend application will be accessible at: `http://localhost:5173`

---

## Verification & Testing

To run backend automated tests:

```bash
cd backend
pytest tests/
```

---

## Research Data Policy

This prototype clearly distinguishes:
- `OBSERVED_DATA`
- `DERIVED_FEATURE`
- `MODEL_ESTIMATE`
- `PREDICTION`
- `SIMULATION`
- `SYNTHETIC_DEMO_DATA`

All mock/synthetic data endpoints explicitly return metadata `"synthetic_demo_data": true` to preserve scientific integrity.
