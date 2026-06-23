from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List

from database import SessionLocal, engine
import models, schemas

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Tienda de Ropa MVP API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def obtener_producto_o_404(producto_id: int, db: Session = Depends(get_db)):
    producto = db.query(models.Producto).filter(models.Producto.id == producto_id).first()
    if not producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    return producto

@app.get("/")
def home():
    return {"message": "Backend funcionando"}

@app.get("/productos", response_model=List[schemas.Producto], tags=["Productos"])
def listar_productos(db: Session = Depends(get_db)):
    return db.query(models.Producto).all()

@app.get("/productos/{producto_id}", response_model=schemas.Producto, tags=["Productos"])
def obtener_producto(producto: models.Producto = Depends(obtener_producto_o_404)):
    return producto

@app.post("/productos", response_model=schemas.Producto, status_code=201, tags=["Productos"])
def crear_producto(producto: schemas.ProductoCreate, db: Session = Depends(get_db)):
    nuevo = models.Producto(**producto.dict())
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return nuevo

@app.put("/productos/{producto_id}", response_model=schemas.Producto, tags=["Productos"])
def actualizar_producto(datos: schemas.ProductoCreate, producto: models.Producto = Depends(obtener_producto_o_404), db: Session = Depends(get_db)):
    for campo, valor in datos.dict().items():
        setattr(producto, campo, valor)
    db.commit()
    db.refresh(producto)
    return producto

@app.delete("/productos/{producto_id}", tags=["Productos"])
def eliminar_producto(producto: models.Producto = Depends(obtener_producto_o_404), db: Session = Depends(get_db)):
    db.delete(producto)
    db.commit()
    return {"mensaje": "Producto eliminado"}
