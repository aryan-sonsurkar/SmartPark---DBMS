-- ============================================================
-- SmartPark Vehicle Management System
-- Supabase PostgreSQL Migration
-- ============================================================
-- Paste this entire script into Supabase SQL Editor and run it.
-- ============================================================

-- Drop existing tables if they exist (for clean re-runs)
DROP TABLE IF EXISTS payment CASCADE;
DROP TABLE IF EXISTS parking_record CASCADE;
DROP TABLE IF EXISTS parking_slot CASCADE;
DROP TABLE IF EXISTS vehicle CASCADE;
DROP TABLE IF EXISTS owner CASCADE;
DROP TABLE IF EXISTS app_user CASCADE;

-- ============================================================
-- 0. APP_USER TABLE (Simple password auth)
-- ============================================================
CREATE TABLE app_user (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role VARCHAR(10) NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
    owner_id INT
);

-- ============================================================
-- 1. OWNER TABLE
-- ============================================================
CREATE TABLE owner (
    owner_id INT PRIMARY KEY,
    owner_name VARCHAR(50) NOT NULL,
    phone_no VARCHAR(15) NOT NULL
);

-- Add FK constraint after owner table exists
ALTER TABLE app_user ADD CONSTRAINT fk_app_user_owner
    FOREIGN KEY (owner_id) REFERENCES owner(owner_id);

-- ============================================================
-- 2. VEHICLE TABLE
-- ============================================================
CREATE TABLE vehicle (
    vehicle_id VARCHAR(10) PRIMARY KEY,
    vehicle_number VARCHAR(15) NOT NULL UNIQUE,
    vehicle_type VARCHAR(20) NOT NULL CHECK (vehicle_type IN ('Car', 'Bike', 'SUV', 'Truck')),
    owner_id INT NOT NULL,
    FOREIGN KEY (owner_id) REFERENCES owner(owner_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- ============================================================
-- 3. PARKING_SLOT TABLE
-- ============================================================
CREATE TABLE parking_slot (
    slot_id VARCHAR(10) PRIMARY KEY,
    slot_number VARCHAR(10) NOT NULL UNIQUE,
    slot_status VARCHAR(20) NOT NULL DEFAULT 'Available'
        CHECK (slot_status IN ('Available', 'Occupied', 'Maintenance'))
);

-- ============================================================
-- 4. PARKING_RECORD TABLE
-- ============================================================
CREATE TABLE parking_record (
    record_id SERIAL PRIMARY KEY,
    vehicle_id VARCHAR(10) NOT NULL,
    slot_id VARCHAR(10) NOT NULL,
    entry_time TIMESTAMP NOT NULL DEFAULT NOW(),
    exit_time TIMESTAMP,
    FOREIGN KEY (vehicle_id) REFERENCES vehicle(vehicle_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (slot_id) REFERENCES parking_slot(slot_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- ============================================================
-- 5. PAYMENT TABLE
-- ============================================================
CREATE TABLE payment (
    payment_id VARCHAR(10) PRIMARY KEY,
    record_id INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL CHECK (amount >= 0),
    payment_mode VARCHAR(20) NOT NULL CHECK (payment_mode IN ('Cash', 'UPI', 'Card')),
    FOREIGN KEY (record_id) REFERENCES parking_record(record_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- ============================================================
-- INDEXES for faster queries
-- ============================================================
CREATE INDEX idx_vehicle_owner ON vehicle(owner_id);
CREATE INDEX idx_parking_record_vehicle ON parking_record(vehicle_id);
CREATE INDEX idx_parking_record_slot ON parking_record(slot_id);
CREATE INDEX idx_parking_record_status ON parking_record(exit_time);
CREATE INDEX idx_payment_record ON payment(record_id);

-- ============================================================
-- ENABLE ROW LEVEL SECURITY (RLS)
-- ============================================================
ALTER TABLE app_user ENABLE ROW LEVEL SECURITY;
ALTER TABLE owner ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle ENABLE ROW LEVEL SECURITY;
ALTER TABLE parking_slot ENABLE ROW LEVEL SECURITY;
ALTER TABLE parking_record ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- RLS POLICIES
-- Allow all operations for authenticated and anonymous users
-- (Adjust these later based on your auth requirements)
-- ============================================================

-- APP_USER policies
CREATE POLICY "Allow all on app_user" ON app_user
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- OWNER policies
CREATE POLICY "Allow all on owner" ON owner
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- VEHICLE policies
CREATE POLICY "Allow all on vehicle" ON vehicle
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- PARKING_SLOT policies
CREATE POLICY "Allow all on parking_slot" ON parking_slot
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- PARKING_RECORD policies
CREATE POLICY "Allow all on parking_record" ON parking_record
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- PAYMENT policies
CREATE POLICY "Allow all on payment" ON payment
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- ============================================================
-- INSERT SAMPLE DATA
-- ============================================================

-- App Users (simple password auth)
INSERT INTO app_user (username, password, full_name, role, owner_id) VALUES
('admin', 'admin123', 'Aryan Sonsurkar', 'admin', 103),
('rahul', 'rahul123', 'Rahul Sharma', 'user', 101),
('priya', 'priya123', 'Priya Patil', 'user', 102);

-- Owners
INSERT INTO owner (owner_id, owner_name, phone_no) VALUES
(101, 'Rahul Sharma', '9876543210'),
(102, 'Priya Patil', '9988776655'),
(103, 'Aryan Sonsurkar', '9123456780'),
(104, 'Sneha Deshmukh', '9012345678'),
(105, 'Vikram Jadhav', '9876501234');

-- Vehicles
INSERT INTO vehicle (vehicle_id, vehicle_number, vehicle_type, owner_id) VALUES
('V101', 'MH01AB1234', 'Car', 101),
('V102', 'MH02CD5678', 'Bike', 102),
('V103', 'MH12EF9012', 'SUV', 103),
('V104', 'MH14GH3456', 'Car', 104),
('V105', 'KA05IJ7890', 'Truck', 105),
('V106', 'MH03KL1122', 'Bike', 101),
('V107', 'MH06MN3344', 'Car', 103);

-- Parking Slots (Floor 1: A1-A4, Floor 2: B1-B4, Floor 3: C1-C4)
INSERT INTO parking_slot (slot_id, slot_number, slot_status) VALUES
('S01', 'A1', 'Available'),
('S02', 'A2', 'Occupied'),
('S03', 'A3', 'Available'),
('S04', 'A4', 'Maintenance'),
('S05', 'B1', 'Occupied'),
('S06', 'B2', 'Available'),
('S07', 'B3', 'Available'),
('S08', 'B4', 'Occupied'),
('S09', 'C1', 'Available'),
('S10', 'C2', 'Occupied'),
('S11', 'C3', 'Available'),
('S12', 'C4', 'Maintenance');

-- Parking Records
INSERT INTO parking_record (record_id, vehicle_id, slot_id, entry_time, exit_time) VALUES
(1, 'V101', 'S02', '2026-07-26 08:00:00', NULL),
(2, 'V103', 'S05', '2026-07-26 09:30:00', NULL),
(3, 'V102', 'S08', '2026-07-26 07:15:00', NULL),
(4, 'V104', 'S10', '2026-07-26 10:00:00', '2026-07-26 12:30:00'),
(5, 'V101', 'S03', '2026-07-25 14:00:00', '2026-07-25 17:00:00');

-- Payments
INSERT INTO payment (payment_id, record_id, amount, payment_mode) VALUES
('P101', 4, 100.00, 'UPI'),
('P102', 5, 150.00, 'Cash');

-- ============================================================
-- USEFUL QUERIES (for your team to use in the app)
-- ============================================================

-- 1. Get all vehicles with owner details
-- SELECT v.*, o.owner_name, o.phone_no
-- FROM vehicle v
-- JOIN owner o ON v.owner_id = o.owner_id;

-- 2. Get available parking slots
-- SELECT * FROM parking_slot WHERE slot_status = 'Available';

-- 3. Get active parking sessions (exit_time is NULL)
-- SELECT pr.*, v.vehicle_number, v.vehicle_type, ps.slot_number
-- FROM parking_record pr
-- JOIN vehicle v ON pr.vehicle_id = v.vehicle_id
-- JOIN parking_slot ps ON pr.slot_id = ps.slot_id
-- WHERE pr.exit_time IS NULL;

-- 4. Get parking history with payment details
-- SELECT pr.*, v.vehicle_number, ps.slot_number,
--        p.amount, p.payment_mode
-- FROM parking_record pr
-- JOIN vehicle v ON pr.vehicle_id = v.vehicle_id
-- JOIN parking_slot ps ON pr.slot_id = ps.slot_id
-- LEFT JOIN payment p ON pr.record_id = p.record_id
-- ORDER BY pr.entry_time DESC;

-- 5. Calculate parking duration and charges
-- SELECT pr.record_id, v.vehicle_number, ps.slot_number,
--        pr.entry_time, pr.exit_time,
--        EXTRACT(EPOCH FROM (COALESCE(pr.exit_time, NOW()) - pr.entry_time))/3600 AS hours_parked,
--        ROUND(EXTRACT(EPOCH FROM (COALESCE(pr.exit_time, NOW()) - pr.entry_time))/3600 * 50, 2) AS estimated_charge
-- FROM parking_record pr
-- JOIN vehicle v ON pr.vehicle_id = v.vehicle_id
-- JOIN parking_slot ps ON pr.slot_id = ps.slot_id;

-- ============================================================
-- DONE! Your database is ready.
-- ============================================================
