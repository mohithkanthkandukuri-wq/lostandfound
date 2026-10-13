-- ====================================================================
-- CampusFound: Modern Campus Lost & Found Management Platform
-- Relational Database Schema (Compatible with MySQL 8.0+ and PostgreSQL)
-- ====================================================================

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(25),
    role VARCHAR(20) NOT NULL DEFAULT 'USER', -- 'USER', 'ADMIN'
    avatar VARCHAR(255),
    student_id VARCHAR(50),
    department VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_email (email),
    INDEX idx_user_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Items Table
CREATE TABLE IF NOT EXISTS items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) NOT NULL, -- 'Electronics', 'ID Cards', 'Keys', 'Bags', 'Books', 'Clothing', 'Accessories', 'Other'
    report_type VARCHAR(20) NOT NULL, -- 'LOST', 'FOUND'
    location VARCHAR(200) NOT NULL,
    incident_date DATE NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'OPEN', -- 'OPEN', 'RESOLVED', 'CLOSED'
    image_path VARCHAR(255),
    secret_verification_hint VARCHAR(255),
    reporter_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_items_reporter FOREIGN KEY (reporter_id) 
        REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_item_report_type (report_type),
    INDEX idx_item_category (category),
    INDEX idx_item_status (status),
    INDEX idx_item_location (location),
    INDEX idx_item_reporter (reporter_id),
    INDEX idx_item_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Claims Table
CREATE TABLE IF NOT EXISTS claims (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    item_id BIGINT NOT NULL,
    claimant_id BIGINT NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING', -- 'PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'
    reviewed_by BIGINT NULL,
    review_message TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_claims_item FOREIGN KEY (item_id) 
        REFERENCES items(id) ON DELETE CASCADE,
    CONSTRAINT fk_claims_claimant FOREIGN KEY (claimant_id) 
        REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_claims_reviewer FOREIGN KEY (reviewed_by) 
        REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_claim_item (item_id),
    INDEX idx_claim_claimant (claimant_id),
    INDEX idx_claim_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_notifications_user FOREIGN KEY (user_id) 
        REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_notification_user (user_id),
    INDEX idx_notification_is_read (is_read)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed Data: Sample Demo Users
INSERT INTO users (id, name, email, password_hash, phone, role, student_id, department)
VALUES 
(1, 'Alex Rivera', 'alex.rivera@campus.edu', '$2a$10$wKqKzE6F3y1.Vf7k9YlJp.qK6eGj3y1.Vf7k9YlJp', '+1-555-234-8901', 'USER', 'ST-2024-8841', 'Computer Science & Engineering'),
(2, 'Maya Chen', 'maya.chen@campus.edu', '$2a$10$wKqKzE6F3y1.Vf7k9YlJp.qK6eGj3y1.Vf7k9YlJp', '+1-555-456-7812', 'USER', 'ST-2023-3920', 'Biomedical Sciences'),
(3, 'Officer David Morgan', 'david.morgan@campus.edu', '$2a$10$wKqKzE6F3y1.Vf7k9YlJp.qK6eGj3y1.Vf7k9YlJp', '+1-555-019-2834', 'ADMIN', 'STAFF-SEC-09', 'Campus Safety & Lost/Found Desk')
ON DUPLICATE KEY UPDATE name=VALUES(name);
