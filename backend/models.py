from sqlalchemy import Column, Integer, String, Float, DateTime
from sqlalchemy.sql import func
from database import Base


class Producto(Base):
    __tablename__ = "productos"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False)
    descripcion = Column(String(300), nullable=True)
    precio = Column(Float, nullable=False)
    categoria = Column(String(50), nullable=True)
    url_imagen = Column(String(500), nullable=True)
    creado_en = Column(DateTime(timezone=True), server_default=func.now())
