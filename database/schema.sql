-- WoodCraftPro Database Schema Script
-- MySQL Database: woodcraftpro_db

CREATE DATABASE IF NOT EXISTS woodcraftpro_db DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE woodcraftpro_db;

-- 1. USERS TABLE (Admin Users)
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    full_name VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'ROLE_ADMIN',
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. CUSTOMERS TABLE
CREATE TABLE IF NOT EXISTS customers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(100),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    image_url VARCHAR(500)
);

-- 4. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS products (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    category_id BIGINT NOT NULL,
    product_name VARCHAR(150) NOT NULL,
    description TEXT,
    base_price DECIMAL(10, 2) NOT NULL,
    image_url VARCHAR(500),
    available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

-- 5. SERVICES TABLE
CREATE TABLE IF NOT EXISTS services (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    service_name VARCHAR(150) NOT NULL,
    description TEXT,
    icon_name VARCHAR(50) DEFAULT 'Hammer',
    image_url VARCHAR(500)
);

-- 6. GALLERY TABLE
CREATE TABLE IF NOT EXISTS gallery (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    image_url VARCHAR(500),
    completed_date DATE
);

-- 7. INQUIRIES TABLE
CREATE TABLE IF NOT EXISTS inquiries (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    customer_name VARCHAR(100) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    customer_email VARCHAR(100),
    message TEXT NOT NULL,
    status VARCHAR(30) DEFAULT 'NEW', -- NEW, CONTACTED, COMPLETED
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. QUOTATIONS TABLE
CREATE TABLE IF NOT EXISTS quotations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    quotation_number VARCHAR(50) NOT NULL UNIQUE,
    customer_name VARCHAR(100) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    customer_email VARCHAR(100),
    customer_address TEXT,
    material_cost DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    labour_cost DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    additional_charges DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    total_amount DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    status VARCHAR(30) DEFAULT 'DRAFT', -- DRAFT, SENT, ACCEPTED, REJECTED
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    valid_until DATE
);

-- 9. QUOTATION_ITEMS TABLE
CREATE TABLE IF NOT EXISTS quotation_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    quotation_id BIGINT NOT NULL,
    item_name VARCHAR(150) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    unit_price DECIMAL(10, 2) NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (quotation_id) REFERENCES quotations(id) ON DELETE CASCADE
);

-- 10. BILLS TABLE
CREATE TABLE IF NOT EXISTS bills (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    bill_number VARCHAR(50) NOT NULL UNIQUE,
    quotation_id BIGINT UNIQUE,
    customer_name VARCHAR(100) NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    paid_amount DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    balance_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(30) DEFAULT 'UNPAID', -- UNPAID, PARTIAL, PAID
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    due_date DATE,
    FOREIGN KEY (quotation_id) REFERENCES quotations(id) ON DELETE SET NULL
);

-- 11. PAYMENTS TABLE
CREATE TABLE IF NOT EXISTS payments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    bill_id BIGINT NOT NULL,
    receipt_number VARCHAR(50) NOT NULL UNIQUE,
    amount DECIMAL(10, 2) NOT NULL,
    payment_method VARCHAR(50) DEFAULT 'CASH', -- CASH, BANK_TRANSFER, CHEQUE, CARD
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,
    FOREIGN KEY (bill_id) REFERENCES bills(id) ON DELETE CASCADE
);
