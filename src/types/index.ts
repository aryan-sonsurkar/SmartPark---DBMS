export interface User {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  role: "admin" | "user";
  created_at: string;
}

export interface Vehicle {
  id: string;
  owner_id: string;
  plate_number: string;
  model: string;
  color: string;
  vehicle_type: "car" | "bike" | "truck" | "suv";
  created_at: string;
}

export interface ParkingSlot {
  id: string;
  slot_number: string;
  floor: number;
  slot_type: "compact" | "standard" | "large";
  status: "available" | "occupied" | "maintenance";
}

export interface ParkingRecord {
  id: string;
  vehicle_id: string;
  slot_id: string;
  entry_time: string;
  exit_time: string | null;
  status: "active" | "completed";
  vehicle?: Vehicle;
  slot?: ParkingSlot;
}

export interface Payment {
  id: string;
  parking_record_id: string;
  amount: number;
  payment_method: "cash" | "upi" | "card";
  paid_at: string;
  record?: ParkingRecord;
}
