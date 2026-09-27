from datetime import datetime
from sqlalchemy import Column, Integer, Float, DateTime, JSON, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base


class EnvironmentalState(Base):
    __tablename__ = "environmental_states"

    id = Column(Integer, primary_key=True, index=True)
    watershed_id = Column(Integer, ForeignKey("watersheds.id"), nullable=False)
    timestamp = Column(DateTime, index=True, nullable=False, default=datetime.utcnow)
    
    # Soil metrics
    soil_moisture = Column(Float, nullable=True)  # %
    soil_ph = Column(Float, nullable=True)
    soil_organic_carbon = Column(Float, nullable=True)  # g/kg
    
    # Vegetation metrics
    ndvi = Column(Float, nullable=True)
    evi = Column(Float, nullable=True)
    
    # Water metrics
    ndwi = Column(Float, nullable=True)
    water_body_index = Column(Float, nullable=True)
    
    # Climate metrics
    precipitation_mm = Column(Float, nullable=True)
    temperature_c = Column(Float, nullable=True)
    humidity_pct = Column(Float, nullable=True)
    wind_speed_ms = Column(Float, nullable=True)
    
    # Composite health index
    vegetation_health_index = Column(Float, nullable=True)
    
    # Confidence & Uncertainty metrics
    overall_confidence = Column(Float, nullable=False, default=0.85)
    uncertainty_score = Column(Float, nullable=False, default=0.15)
    
    # Provenance metadata (sources, algorithm, synthetic_demo_data flag)
    provenance = Column(JSON, nullable=False, default=dict)

    # Relationships
    watershed = relationship("Watershed", backref="environmental_states")
