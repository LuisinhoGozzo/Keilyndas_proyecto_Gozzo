CREATE DATABASE IF NOT EXISTS keilyndas_db;
USE keilyndas_db;
CREATE TABLE IF NOT EXISTS clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_completo VARCHAR(100) NOT NULL,
    telefono VARCHAR(15) NOT NULL,
    email VARCHAR(50) UNIQUE NOT NULL,
    clave VARCHAR(255) NOT NULL,
    rol ENUM('cliente', 'admin') DEFAULT 'cliente',
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS citas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_completo VARCHAR(100) NOT NULL,
    telefono VARCHAR(15) NOT NULL,
    email VARCHAR(50),
    sistema VARCHAR(50) NOT NULL,
    tamano VARCHAR(50) NOT NULL,
    estilo VARCHAR(50) NOT NULL,
    diseno VARCHAR(50) NOT NULL,
    fecha_cita DATE NOT NULL,
    hora_cita VARCHAR(10) NOT NULL,
    tipo_servicio VARCHAR(20) NOT NULL,
    direccion TEXT NOT NULL,
    remocion ENUM('si', 'no') DEFAULT 'no',
    foto_referencia LONGTEXT DEFAULT NULL,    
    monto_total DECIMAL(10, 2) NOT NULL,
    monto_deposito DECIMAL(10, 2) NOT NULL,
    ref_deposito VARCHAR(15) NOT NULL,
    estado ENUM('pre-reservada', 'pendiente', 'confirmada', 'rechazada') DEFAULT 'pre-reservada',
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (email) REFERENCES clientes(email) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS horarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    hora_disponible VARCHAR(10)
);

INSERT IGNORE INTO horarios (hora_disponible) VALUES 
('08:00 AM'), 
('11:30 AM'),  
('03:30 PM');

DELETE FROM clientes WHERE email = 'lgozzo1206@gmail.com';

INSERT INTO clientes (nombre_completo, telefono, email, clave, rol) 
VALUES (
    'Luis Gozzo', 
    '04126133543', 
    'lgozzo1206@gmail.com', 
    '$2b$10$tZ261v7RjX8i.oK8G.kM.eXm.9/K3J.Yg5Z6L.G9wL3E0w9E0w9E2',
    'admin'
);