import { supabase } from "@/lib/supabase";
import type { Owner, Vehicle, ParkingSlot, ParkingRecord, Payment } from "@/types";

// ============ FETCH ALL ============

export async function fetchOwners(): Promise<Owner[]> {
  const { data, error } = await supabase.from("owner").select("*");
  if (error) throw error;
  return data || [];
}

export async function fetchVehicles(): Promise<Vehicle[]> {
  const { data, error } = await supabase.from("vehicle").select("*, owner(*)");
  if (error) throw error;
  return data || [];
}

export async function fetchSlots(): Promise<ParkingSlot[]> {
  const { data, error } = await supabase.from("parking_slot").select("*");
  if (error) throw error;
  return data || [];
}

export async function fetchRecords(): Promise<ParkingRecord[]> {
  const { data, error } = await supabase.from("parking_record").select("*, vehicle(*), slot(*)");
  if (error) throw error;
  return data || [];
}

export async function fetchPayments(): Promise<Payment[]> {
  const { data, error } = await supabase.from("payment").select("*, record(*)");
  if (error) throw error;
  return data || [];
}

// ============ VEHICLE CRUD ============

export async function addVehicle(vehicle: Omit<Vehicle, "owner">) {
  const { error } = await supabase.from("vehicle").insert(vehicle);
  if (error) throw error;
}

export async function updateVehicle(id: string, updates: Partial<Vehicle>) {
  const { error } = await supabase.from("vehicle").update(updates).eq("vehicle_id", id);
  if (error) throw error;
}

export async function deleteVehicle(id: string) {
  const { error } = await supabase.from("vehicle").delete().eq("vehicle_id", id);
  if (error) throw error;
}

// ============ SLOT CRUD ============

export async function updateSlotStatus(id: string, status: ParkingSlot["slot_status"]) {
  const { error } = await supabase.from("parking_slot").update({ slot_status: status }).eq("slot_id", id);
  if (error) throw error;
}

export async function addSlot(slot: Omit<ParkingSlot, "">) {
  const { error } = await supabase.from("parking_slot").insert(slot);
  if (error) throw error;
}

export async function updateSlot(id: string, updates: Partial<ParkingSlot>) {
  const { error } = await supabase.from("parking_slot").update(updates).eq("slot_id", id);
  if (error) throw error;
}

export async function deleteSlot(id: string) {
  const { error } = await supabase.from("parking_slot").delete().eq("slot_id", id);
  if (error) throw error;
}

// ============ RECORD CRUD ============

export async function addRecord(record: { vehicle_id: string; slot_id: string }) {
  const { error } = await supabase.from("parking_record").insert({
    ...record,
    entry_time: new Date().toISOString(),
  });
  if (error) throw error;

  // Update slot status to Occupied
  await updateSlotStatus(record.slot_id, "Occupied");
}

export async function checkOut(record_id: number) {
  const { error } = await supabase
    .from("parking_record")
    .update({ exit_time: new Date().toISOString() })
    .eq("record_id", record_id);
  if (error) throw error;
}

// ============ PAYMENT CRUD ============

export async function addPayment(payment: { payment_id: string; record_id: number; amount: number; payment_mode: string }) {
  const { error } = await supabase.from("payment").insert(payment);
  if (error) throw error;
}
