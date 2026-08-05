export interface Owner {
  owner_id: number;
  owner_name: string;
  phone_no: string;
}

export interface Vehicle {
  vehicle_id: string;
  vehicle_number: string;
  vehicle_type: "Car" | "Bike" | "SUV" | "Truck";
  owner_id: number;
  owner?: Owner;
}

export interface ParkingSlot {
  slot_id: string;
  slot_number: string;
  slot_status: "Available" | "Occupied" | "Maintenance";
}

export interface ParkingRecord {
  record_id: number;
  vehicle_id: string;
  slot_id: string;
  entry_time: string;
  exit_time: string | null;
  vehicle?: Vehicle;
  slot?: ParkingSlot;
}

export interface Payment {
  payment_id: string;
  record_id: number;
  amount: number;
  payment_mode: "Cash" | "UPI" | "Card";
  record?: ParkingRecord;
}
