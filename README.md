# webPruebaGenesis
Desarrollo web para empresa dedicada a la venta de mariscos.

-- CREACION DE LAS TABLAS
use inventario_mariscos;

-- Crear tabla Productos con el campo 'cantidad_en_existencia' agregado
CREATE TABLE Productos (
    id_producto INT AUTO_INCREMENT PRIMARY KEY,
    nombre_producto VARCHAR(255) NOT NULL,
    descripcion VARCHAR(255),
    precio_por_libra DECIMAL(10, 2) NOT NULL,
    cantidad_en_existencia DECIMAL(10, 2) NOT NULL
);

-- Crear tabla Combos para manejar los combos de productos
CREATE TABLE Combos (
    id_combo INT AUTO_INCREMENT PRIMARY KEY,
    nombre_combo VARCHAR(255) NOT NULL,
    precio_combo DECIMAL(10, 2) NOT NULL
);

-- Crear tabla de relación entre Combos y Productos
CREATE TABLE Combo_Productos (
    id_combo_producto INT AUTO_INCREMENT PRIMARY KEY,
    id_combo INT,
    id_producto INT,
    cantidad_en_combo DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (id_combo) REFERENCES Combos(id_combo),
    FOREIGN KEY (id_producto) REFERENCES Productos(id_producto)
);

-- Tabla para ventas de productos individuales
CREATE TABLE Ventas_Productos (
    id_venta_producto INT AUTO_INCREMENT PRIMARY KEY,
    fecha_venta DATE NOT NULL,
    tipo_venta ENUM('libra', 'media_libra') NOT NULL,
    cantidad_vendida DECIMAL(10, 2) NOT NULL,
    id_producto INT NOT NULL,
    tipo_empaque ENUM('caja_4_libras', 'caja_3_libras'), -- Nuevo campo para el tipo de empaque
    FOREIGN KEY (id_producto) REFERENCES Productos(id_producto)
);

-- Tabla para ventas de combos
CREATE TABLE Ventas_Combos (
    id_venta_combo INT AUTO_INCREMENT PRIMARY KEY,
    fecha_venta DATE NOT NULL,
    tipo_venta ENUM('combo') NOT NULL,
    cantidad_vendida DECIMAL(10, 2) NOT NULL,
    id_combo INT NOT NULL,
    tipo_empaque ENUM('caja_4_libras', 'caja_3_libras') NOT NULL, -- Agregado tipo de empaque
    FOREIGN KEY (id_combo) REFERENCES Combos(id_combo)
);

