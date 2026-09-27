from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, JSON, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base


class GroundObservation(Base):
    __tablename__ = "ground_observations"

    id = Column(Integer, primary_key=True, index=True)
    sensor_id = Column(Integer, ForeignKey("sensors.id"), nullable=False)
    timestamp = Column(DateTime, index=True, nullable=False, default=datetime.utcnow)
    variable_name = Column(String(50), nullable=False)  # soil_moisture, temperature, rainfall, etc.
    value = Column(Float, nullable=False)
    unit = Column(String(20), nullable=False)
    quality_flag = Column(String(20), default="GOOD")  # GOOD, SUSPECT, MOCK
    confidence_score = Column(Float, default=1.0)
    metadata_json = Column(JSON, default=dict)

    # Relationships
    sensor = relationship("Sensor", backref="observations")
