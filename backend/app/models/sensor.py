from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, JSON, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base


class Sensor(Base):
    __tablename__ = "sensors"

    id = Column(Integer, primary_key=True, index=True)
    watershed_id = Column(Integer, ForeignKey("watersheds.id"), nullable=False)
    sensor_code = Column(String(50), unique=True, index=True, nullable=False)
    sensor_type = Column(String(50), nullable=False)  # SOIL_MOISTURE, WEATHER, WATER_LEVEL, MULTI_PARAM
    name = Column(String(100), nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    elevation_m = Column(Float, nullable=True)
    status = Column(String(20), default="ACTIVE")
    installation_date = Column(DateTime, default=datetime.utcnow)
    metadata_json = Column(JSON, default=dict)

    # Relationships
    watershed = relationship("Watershed", backref="sensors")
