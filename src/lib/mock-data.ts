import type { Owner, Vehicle, ParkingSlot, ParkingRecord, Payment } from "@/types";

export const mockOwners: Owner[] = [
  { owner_id: 101, owner_name: "Rahul Sharma", phone_no: "9876543210" },
  { owner_id: 102, owner_name: "Priya Patil", phone_no: "9988776655" },
  { owner_id: 103, owner_name: "Aryan Sonsurkar", phone_no: "9123456780" },
  { owner_id: 104, owner_name: "Sneha Deshmukh", phone_no: "9012345678" },
  { owner_id: 105, owner_name: "Vikram Jadhav", phone_no: "9876501234" },
];

export const mockVehicles: Vehicle[] = [
  { vehicle_id: "V101", vehicle_number: "MH01AB1234", vehicle_type: "Car", owner_id: 101, owner: mockOwners[0] },
  { vehicle_id: "V102", vehicle_number: "MH02CD5678", vehicle_type: "Bike", owner_id: 102, owner: mockOwners[1] },
  { vehicle_id: "V103", vehicle_number: "MH12EF9012", vehicle_type: "SUV", owner_id: 103, owner: mockOwners[2] },
  { vehicle_id: "V104", vehicle_number: "MH14GH3456", vehicle_type: "Car", owner_id: 104, owner: mockOwners[3] },
  { vehicle_id: "V105", vehicle_number: "KA05IJ7890", vehicle_type: "Truck", owner_id: 105, owner: mockOwners[4] },
  { vehicle_id: "V106", vehicle_number: "MH03KL1122", vehicle_type: "Bike", owner_id: 101, owner: mockOwners[0] },
  { vehicle_id: "V107", vehicle_number: "MH06MN3344", vehicle_type: "Car", owner_id: 103, owner: mockOwners[2] },
];

export const mockSlots: ParkingSlot[] = [
  { slot_id: "S01", slot_number: "A1", slot_status: "Available" },
  { slot_id: "S02", slot_number: "A2", slot_status: "Occupied" },
  { slot_id: "S03", slot_number: "A3", slot_status: "Available" },
  { slot_id: "S04", slot_number: "A4", slot_status: "Maintenance" },
  { slot_id: "S05", slot_number: "B1", slot_status: "Occupied" },
  { slot_id: "S06", slot_number: "B2", slot_status: "Available" },
  { slot_id: "S07", slot_number: "B3", slot_status: "Available" },
  { slot_id: "S08", slot_number: "B4", slot_status: "Occupied" },
  { slot_id: "S09", slot_number: "C1", slot_status: "Available" },
  { slot_id: "S10", slot_number: "C2", slot_status: "Occupied" },
  { slot_id: "S11", slot_number: "C3", slot_status: "Available" },
  { slot_id: "S12", slot_number: "C4", slot_status: "Maintenance" },
];

export const mockRecords: ParkingRecord[] = [
  { record_id: 1, vehicle_id: "V101", slot_id: "S02", entry_time: "2026-07-26T08:00:00", exit_time: null, vehicle: mockVehicles[0], slot: mockSlots[1] },
  { record_id: 2, vehicle_id: "V103", slot_id: "S05", entry_time: "2026-07-26T09:30:00", exit_time: null, vehicle: mockVehicles[2], slot: mockSlots[4] },
  { record_id: 3, vehicle_id: "V102", slot_id: "S08", entry_time: "2026-07-26T07:15:00", exit_time: null, vehicle: mockVehicles[1], slot: mockSlots[7] },
  { record_id: 4, vehicle_id: "V104", slot_id: "S10", entry_time: "2026-07-26T10:00:00", exit_time: "2026-07-26T12:30:00", vehicle: mockVehicles[3], slot: mockSlots[9] },
  { record_id: 5, vehicle_id: "V101", slot_id: "S03", entry_time: "2026-07-25T14:00:00", exit_time: "2026-07-25T17:00:00", vehicle: mockVehicles[0], slot: mockSlots[2] },
];

export const mockPayments: Payment[] = [
  { payment_id: "P101", record_id: 4, amount: 100, payment_mode: "UPI", record: mockRecords[3] },
  { payment_id: "P102", record_id: 5, amount: 150, payment_mode: "Cash", record: mockRecords[4] },
];

export const mockUser = {
  id: "u1",
  full_name: "Aryan Sonsurkar",
  email: "aryan@example.com",
  phone: "9123456780",
  role: "admin" as const,
  owner_id: 103,
};
