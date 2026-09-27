import logging
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, declarative_base
from app.core.config import settings

logger = logging.getLogger(__name__)

# Base class for SQLAlchemy models
Base = declarative_base()

# Engine creation
try:
    engine = create_engine(
        settings.SQLALCHEMY_DATABASE_URI,
        pool_pre_ping=True,
        echo=False,
    )
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
except Exception as e:
    logger.warning(f"Could not connect to PostgreSQL ({e}). Using SQLite fallback for local development.")
    sqlite_uri = "sqlite:///./bhu_tattva_dev.db"
    engine = create_engine(sqlite_uri, connect_args={"check_same_thread": False})
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def check_db_connection() -> dict:
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
            # Check PostGIS extension
            is_postgis = False
            try:
                res = conn.execute(text("SELECT PostGIS_Version()")).fetchone()
                postgis_ver = res[0] if res else None
                is_postgis = True
            except Exception:
                postgis_ver = "PostGIS extension not installed / SQLite fallback mode"
            
            return {
                "connected": True,
                "database": settings.POSTGRES_DB if "postgresql" in str(engine.url) else "sqlite_fallback",
                "postgis_enabled": is_postgis,
                "postgis_version": postgis_ver
            }
    except Exception as ex:
        logger.error(f"Database health check failed: {ex}")
        return {
            "connected": False,
            "error": str(ex)
        }
