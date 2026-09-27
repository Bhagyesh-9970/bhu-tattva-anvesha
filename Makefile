.PHONY: dev test lint migrate seed clean docker-up docker-down

dev:
	@echo "Starting development backend and frontend..."
	cd backend && uvicorn app.main:app --reload --port 8000 &
	cd frontend && npm run dev

test:
	@echo "Running backend pytest..."
	cd backend && pytest tests/ -v

migrate:
	@echo "Running Alembic migrations..."
	cd backend && alembic upgrade head

seed:
	@echo "Seeding demo watershed & environmental state data..."
	cd backend && python -m scripts.seed_demo_data

docker-up:
	docker compose up --build -d

docker-down:
	docker compose down -v

clean:
	find . -type d -name "__pycache__" -exec rm -rf {} +
	find . -type d -name ".pytest_cache" -exec rm -rf {} +
