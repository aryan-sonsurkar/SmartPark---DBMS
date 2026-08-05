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
DROP TABLE IF EXISTS profiles CASCADE;

-- ============================================================
-- 0. PROFILES TABLE (linked to Supabase Auth)
-- ============================================================
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
    owner_id INT,
    created_at TIMESTAMPTZ DEFAULT NOW()
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
ALTER TABLE profiles ADD CONSTRAINT fk_profiles_owner
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
CREATE INDEX idx_profiles_owner ON profiles(owner_id);
CREATE INDEX idx_vehicle_owner ON vehicle(owner_id);
CREATE INDEX idx_parking_record_vehicle ON parking_record(vehicle_id);
CREATE INDEX idx_parking_record_slot ON parking_record(slot_id);
CREATE INDEX idx_parking_record_status ON parking_record(exit_time);
CREATE INDEX idx_payment_record ON payment(record_id);

-- ============================================================
-- ENABLE ROW LEVEL SECURITY (RLS)
-- ============================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE owner ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle ENABLE ROW LEVEL SECURITY;
ALTER TABLE parking_slot ENABLE ROW LEVEL SECURITY;
ALTER TABLE parking_record ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- RLS POLICIES
-- ============================================================

-- PROFILES: users can read all profiles, but only update their own
CREATE POLICY "Users can view all profiles" ON profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- OWNER: everyone can read, authenticated users can insert
CREATE POLICY "Allow read on owner" ON owner
    FOR SELECT USING (true);

CREATE POLICY "Allow insert on owner" ON owner
    FOR INSERT WITH CHECK (true);

-- VEHICLE: everyone can read, authenticated users can manage
CREATE POLICY "Allow read on vehicle" ON vehicle
    FOR SELECT USING (true);

CREATE POLICY "Allow insert on vehicle" ON vehicle
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow update on vehicle" ON vehicle
    FOR UPDATE USING (true);

CREATE POLICY "Allow delete on vehicle" ON vehicle
    FOR DELETE USING (true);

-- PARKING_SLOT: everyone can read and update (for real-time status)
CREATE POLICY "Allow read on parking_slot" ON parking_slot
    FOR SELECT USING (true);

CREATE POLICY "Allow insert on parking_slot" ON parking_slot
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow update on parking_slot" ON parking_slot
    FOR UPDATE USING (true);

CREATE POLICY "Allow delete on parking_slot" ON parking_slot
    FOR DELETE USING (true);

-- PARKING_RECORD: everyone can read and manage
CREATE POLICY "Allow read on parking_record" ON parking_record
    FOR SELECT USING (true);

CREATE POLICY "Allow insert on parking_record" ON parking_record
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow update on parking_record" ON parking_record
    FOR UPDATE USING (true);

-- PAYMENT: everyone can read and insert
CREATE POLICY "Allow read on payment" ON payment
    FOR SELECT USING (true);

CREATE POLICY "Allow insert on payment" ON payment
    FOR INSERT WITH CHECK (true);

-- ============================================================
-- FUNCTION: Auto-create profile on signup
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, role)
    VALUES (new.id, COALESCE(new.raw_user_meta_data->>'full_name', new.email), 'user');
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create profile
CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- INSERT SAMPLE DATA
-- ============================================================

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
-- IMPORTANT: Create your first admin user via Supabase Dashboard
-- 1. Go to Authentication > Users > Add User
-- 2. Enter email: admin@smartpark.com, Password: admin123
-- 3. Then run this to make them admin:
-- UPDATE profiles SET role = 'admin' WHERE id = (SELECT id FROM auth.users WHERE email = 'admin@smartpark.com');
-- ============================================================

-- ============================================================
-- DONE! Your database is ready.
-- ============================================================
