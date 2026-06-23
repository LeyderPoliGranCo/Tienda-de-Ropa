from sqlalchemy import Column, Integer, String, DateTime, Enum
from sqlalchemy.sql import func
from database import Base
import enum

class CategoriaEnum(str, enum.Enum):
    camisetas = "Camisetas"
    pantalones = "Pantalones"
    chaquetas = "Chaquetas"
    calzado = "Calzado"

class Producto(Base):
    __tablename__ = "productos"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False)
    descripcion = Column(String(300), nullable=True)
    precio = Column(Integer, nullable=False)
    categoria = Column(Enum(CategoriaEnum), nullable=True)
    url_imagen = Column(String(500), nullable=True)
    creado_en = Column(DateTime(timezone=True), server_default=func.now())
