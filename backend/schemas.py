from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class ProductoBase(BaseModel):
    nombre: str = Field(..., min_length=1, max_length=100, example="Camiseta Basica de Algodon")
    descripcion: Optional[str] = Field(None, max_length=300, example="Camiseta 100% algodon")
    precio: float = Field(..., gt=0, example=35000)
    categoria: Optional[str] = Field(None, max_length=50, example="Camisetas")
    url_imagen: Optional[str] = Field(None, max_length=500, example="https://ejemplo.com/imagen.jpg")

class ProductoCreate(ProductoBase):
    pass

class Producto(ProductoBase):
    id: int
    creado_en: Optional[datetime] = None
    class Config:
        from_attributes = True
