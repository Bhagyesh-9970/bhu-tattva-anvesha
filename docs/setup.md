# Development Setup — BHŪ-TATTVA-ANVEṢA

## Prerequisites
- Python 3.12+
- Node.js 18+
- PostgreSQL 16 with PostGIS extension (or Docker)

## Step-by-Step Setup

### Option A: Docker Setup (Recommended for Full Stack)
1. Run `docker compose up --build -d`
2. Check logs with `docker compose logs -f`
3. Access Frontend at `http://localhost:5173`
4. Access Backend API at `http://localhost:8000/docs`

### Option B: Local Python & Node Setup
1. Backend setup:
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # or .\venv\Scripts\activate on Windows
   pip install -r requirements.txt
   python -m scripts.seed_demo_data
   uvicorn app.main:app --reload --port 8000
   ```
2. Frontend setup:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
