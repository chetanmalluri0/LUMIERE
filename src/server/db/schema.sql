-- ==============================================================================
-- LUMIÈRE Beauty Studio Database Schema (PostgreSQL DDL)
-- Tables: users, admins, services, staff, staff_availability, appointments,
--         notifications, settings
-- ==============================================================================

-- 1. USERS (Customers)
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    phone VARCHAR(30) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'CUSTOMER',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- 2. ADMINS
CREATE TABLE IF NOT EXISTS admins (
    id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'ADMIN',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_admins_email ON admins(email);

-- 3. SERVICES
CREATE TABLE IF NOT EXISTS services (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    duration_minutes INTEGER NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    category VARCHAR(50) NOT NULL,
    image_url TEXT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_services_category ON services(category);

-- 4. STAFF
CREATE TABLE IF NOT EXISTS staff (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    title VARCHAR(150) NOT NULL,
    bio TEXT NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(30) NOT NULL,
    avatar_url TEXT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    days_available JSONB NOT NULL DEFAULT '[1,2,3,4,5,6]',
    hours_start VARCHAR(10) NOT NULL DEFAULT '09:00',
    hours_end VARCHAR(10) NOT NULL DEFAULT '19:00',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. STAFF AVAILABILITY
CREATE TABLE IF NOT EXISTS staff_availability (
    id VARCHAR(36) PRIMARY KEY,
    staff_id VARCHAR(36) NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
    day_of_week INTEGER NOT NULL,
    start_time VARCHAR(10) NOT NULL,
    end_time VARCHAR(10) NOT NULL,
    is_available BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT uq_staff_day UNIQUE (staff_id, day_of_week)
);

CREATE INDEX IF NOT EXISTS idx_staff_avail_staff ON staff_availability(staff_id);

-- 6. APPOINTMENTS
CREATE TABLE IF NOT EXISTS appointments (
    id VARCHAR(36) PRIMARY KEY,
    appointment_number VARCHAR(30) NOT NULL UNIQUE,
    customer_id VARCHAR(36) REFERENCES users(id) ON DELETE SET NULL,
    customer_name VARCHAR(150) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(30) NOT NULL,
    service_id VARCHAR(36) NOT NULL REFERENCES services(id),
    service_name VARCHAR(150) NOT NULL,
    service_price NUMERIC(10, 2) NOT NULL,
    staff_id VARCHAR(36) NOT NULL REFERENCES staff(id),
    staff_name VARCHAR(150) NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time VARCHAR(10) NOT NULL,
    duration_minutes INTEGER NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'Pending',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_appointments_staff ON appointments(staff_id);
CREATE INDEX IF NOT EXISTS idx_appointments_customer ON appointments(customer_id);

-- 7. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS notifications (
    id VARCHAR(36) PRIMARY KEY,
    recipient_type VARCHAR(20) NOT NULL,
    recipient_email VARCHAR(255),
    recipient_phone VARCHAR(30),
    channel VARCHAR(20) NOT NULL,
    template VARCHAR(50) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    appointment_number VARCHAR(30),
    status VARCHAR(20) NOT NULL DEFAULT 'SENT',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. SETTINGS
CREATE TABLE IF NOT EXISTS settings (
    id VARCHAR(36) PRIMARY KEY,
    key VARCHAR(100) NOT NULL UNIQUE,
    value JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
