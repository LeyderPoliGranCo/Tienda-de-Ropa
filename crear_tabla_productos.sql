-- ============================================================
-- TIENDA DE ROPA — Tabla simplificada de productos
-- ============================================================

CREATE TABLE IF NOT EXISTS productos (
    id          SERIAL PRIMARY KEY,
    nombre      VARCHAR(100) NOT NULL,
    descripcion VARCHAR(300),
    precio      NUMERIC(10, 2) NOT NULL CHECK (precio > 0),
    categoria   VARCHAR(50),
    url_imagen  VARCHAR(500),
    creado_en   TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

INSERT INTO productos (nombre, descripcion, precio, categoria, url_imagen) VALUES
('Camiseta Basica de Algodon', 'Camiseta 100% algodon, diseno minimalista y transpirable.', 35000, 'Camisetas', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=500&q=80'),
('Pantalon Denim Clasico', 'Jeans de corte recto con lavado medio oscuro, alta durabilidad.', 120000, 'Pantalones', 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=500&q=80'),
('Chaqueta Cortavientos', 'Chaqueta ligera e impermeable con capucha, ideal para exteriores.', 180000, 'Chaquetas', 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=500&q=80'),
('Zapatillas Urbanas Blancas', 'Calzado comodo y versatil, suela antideslizante para cualquier ocasion.', 250000, 'Calzado', 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=500&q=80')
ON CONFLICT DO NOTHING;
