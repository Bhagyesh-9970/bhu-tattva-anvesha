import sys
import logging
from datetime import datetime, timedelta
from app.core.database import engine, Base, SessionLocal
from app.models import Watershed, Sensor, GroundObservation, EnvironmentalState
from app.services.mock_data_generator import (
    get_demo_watershed_data,
    get_demo_sensors_data,
    generate_synthetic_time_series,
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def seed_database():
    logger.info("Initializing database tables...")
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        # 1. Watershed seeding
        existing_watershed = db.query(Watershed).filter_by(code="KABINI-SUBBASIN-01").first()
        if not existing_watershed:
            ws_data = get_demo_watershed_data()
            watershed = Watershed(**ws_data)
            db.add(watershed)
            db.commit()
            db.refresh(watershed)
            logger.info(f"Seeded watershed: {watershed.name} (ID: {watershed.id})")
        else:
            watershed = existing_watershed
            logger.info(f"Watershed '{watershed.name}' already exists (ID: {watershed.id})")

        # 2. Sensor seeding
        sensors = db.query(Sensor).filter_by(watershed_id=watershed.id).all()
        if not sensors:
            sensor_dicts = get_demo_sensors_data(watershed.id)
            sensor_objs = []
            for s_dict in sensor_dicts:
                s_obj = Sensor(**s_dict)
                db.add(s_obj)
                sensor_objs.append(s_obj)
            db.commit()
            sensors = sensor_objs
            logger.info(f"Seeded {len(sensors)} ground sensors.")
        else:
            logger.info(f"{len(sensors)} sensors already exist.")

        # 3. Ground observations seeding
        obs_count = db.query(GroundObservation).count()
        if obs_count == 0:
            end_date = datetime.utcnow()
            obs_to_add = []
            for sensor in sensors:
                for d in range(30):
                    ts = end_date - timedelta(days=29 - d)
                    val = 20.0 + (d % 5) * 1.5
                    obs = GroundObservation(
                        sensor_id=sensor.id,
                        timestamp=ts,
                        variable_name="soil_moisture" if "SOIL" in sensor.sensor_type else "temperature",
                        value=val,
                        unit="%" if "SOIL" in sensor.sensor_type else "C",
                        quality_flag="GOOD",
                        confidence_score=0.95,
                        metadata_json={"synthetic_demo_data": True}
                    )
                    obs_to_add.append(obs)
            db.add_all(obs_to_add)
            db.commit()
            logger.info(f"Seeded {len(obs_to_add)} ground observations.")

        # 4. Environmental state seeding
        state_count = db.query(EnvironmentalState).filter_by(watershed_id=watershed.id).count()
        if state_count == 0:
            states_data = generate_synthetic_time_series(days=30)
            state_objs = []
            for s_data in states_data:
                state_obj = EnvironmentalState(watershed_id=watershed.id, **s_data)
                state_objs.append(state_obj)
            db.add_all(state_objs)
            db.commit()
            logger.info(f"Seeded {len(state_objs)} environmental states.")
        else:
            logger.info(f"{state_count} environmental states already exist.")

        logger.info("Database seeding completed successfully.")

    except Exception as e:
        logger.error(f"Error seeding database: {e}")
        db.rollback()
        raise e
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()
