import type { User, Vehicle, ParkingSlot, ParkingRecord, Payment } from "@/types";

export const mockUser: User = {
  id: "u1",
  full_name: "Aryan Sonsurkar",
  email: "aryan@example.com",
  phone: "+91 98765 43210",
  role: "admin",
  created_at: "2026-01-15T10:00:00Z",
};

export const mockVehicles: Vehicle[] = [
  { id: "v1", owner_id: "u1", plate_number: "MH-12-AB-1234", model: "Maruti Swift", color: "White", vehicle_type: "car", created_at: "2026-02-01T10:00:00Z" },
  { id: "v2", owner_id: "u1", plate_number: "MH-14-CD-5678", model: "Honda Activa", color: "Black", vehicle_type: "bike", created_at: "2026-03-01T10:00:00Z" },
  { id: "v3", owner_id: "u2", plate_number: "MH-01-EF-9012", model: "Tata Nexon", color: "Blue", vehicle_type: "suv", created_at: "2026-02-15T10:00:00Z" },
  { id: "v4", owner_id: "u3", plate_number: "KA-05-GH-3456", model: "Hyundai Creta", color: "Red", vehicle_type: "car", created_at: "2026-04-01T10:00:00Z" },
  { id: "v5", owner_id: "u1", plate_number: "MH-03-IJ-7890", model: "Tata Ace", color: "Yellow", vehicle_type: "truck", created_at: "2026-05-01T10:00:00Z" },
];

export const mockSlots: ParkingSlot[] = [
  { id: "s1", slot_number: "A1", floor: 1, slot_type: "compact", status: "available" },
  { id: "s2", slot_number: "A2", floor: 1, slot_type: "compact", status: "occupied" },
  { id: "s3", slot_number: "A3", floor: 1, slot_type: "standard", status: "available" },
  { id: "s4", slot_number: "A4", floor: 1, slot_type: "standard", status: "maintenance" },
  { id: "s5", slot_number: "B1", floor: 2, slot_type: "large", status: "occupied" },
  { id: "s6", slot_number: "B2", floor: 2, slot_type: "large", status: "available" },
  { id: "s7", slot_number: "B3", floor: 2, slot_type: "standard", status: "available" },
  { id: "s8", slot_number: "B4", floor: 2, slot_type: "compact", status: "occupied" },
  { id: "s9", slot_number: "C1", floor: 3, slot_type: "standard", status: "available" },
  { id: "s10", slot_number: "C2", floor: 3, slot_type: "standard", status: "occupied" },
  { id: "s11", slot_number: "C3", floor: 3, slot_type: "large", status: "available" },
  { id: "s12", slot_number: "C4", floor: 3, slot_type: "compact", status: "maintenance" },
];

export const mockRecords: ParkingRecord[] = [
  { id: "r1", vehicle_id: "v1", slot_id: "s2", entry_time: "2026-07-26T08:00:00Z", exit_time: null, status: "active", vehicle: mockVehicles[0], slot: mockSlots[1] },
  { id: "r2", vehicle_id: "v3", slot_id: "s5", entry_time: "2026-07-26T09:30:00Z", exit_time: null, status: "active", vehicle: mockVehicles[2], slot: mockSlots[4] },
  { id: "r3", vehicle_id: "v2", slot_id: "s8", entry_time: "2026-07-26T07:15:00Z", exit_time: null, status: "active", vehicle: mockVehicles[1], slot: mockSlots[7] },
  { id: "r4", vehicle_id: "v4", slot_id: "s10", entry_time: "2026-07-26T10:00:00Z", exit_time: "2026-07-26T12:30:00Z", status: "completed", vehicle: mockVehicles[3], slot: mockSlots[9] },
  { id: "r5", vehicle_id: "v1", slot_id: "s3", entry_time: "2026-07-25T14:00:00Z", exit_time: "2026-07-25T17:00:00Z", status: "completed", vehicle: mockVehicles[0], slot: mockSlots[2] },
];

export const mockPayments: Payment[] = [
  { id: "p1", parking_record_id: "r4", amount: 150, payment_method: "upi", paid_at: "2026-07-26T12:30:00Z" },
  { id: "p2", parking_record_id: "r5", amount: 100, payment_method: "cash", paid_at: "2026-07-25T17:00:00Z" },
];
