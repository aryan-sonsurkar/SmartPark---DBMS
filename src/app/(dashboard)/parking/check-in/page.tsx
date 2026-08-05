"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import SlotGrid from "@/components/parking/SlotGrid";
import { fetchVehicles, fetchSlots, addRecord } from "@/lib/db";
import type { Vehicle, ParkingSlot } from "@/types";

export default function CheckInPage() {
  const router = useRouter();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [slots, setSlots] = useState<ParkingSlot[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [selectedSlot, setSelectedSlot] = useState<ParkingSlot | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([fetchVehicles(), fetchSlots()])
      .then(([v, s]) => { setVehicles(v); setSlots(s); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const availableSlots = slots.filter((s) => s.slot_status === "Available");

  const vehicleOptions = vehicles.map((v) => ({
    value: v.vehicle_id,
    label: `${v.vehicle_number} - ${v.vehicle_type}`,
  }));

  const handleCheckIn = async () => {
    if (!selectedVehicle || !selectedSlot) return;
    setSaving(true);
    try {
      await addRecord({ vehicle_id: selectedVehicle, slot_id: selectedSlot.slot_id });
      alert("Check-in successful!");
      router.push("/parking");
    } catch (err) {
      console.error(err);
      alert("Error during check-in");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Check In</h1>
        <p className="text-muted-foreground mt-1 text-sm">Select your vehicle and choose a parking slot.</p>
      </div>

      <div className="bg-card rounded-2xl border border-border p-6">
        <div className="max-w-md space-y-4 mb-6">
          <Select
            label="Select Vehicle"
            value={selectedVehicle}
            onChange={(e) => setSelectedVehicle(e.target.value)}
            options={[{ value: "", label: "Choose a vehicle..." }, ...vehicleOptions]}
          />
        </div>

        <div>
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">Choose a Slot</h3>
          {availableSlots.length === 0 ? (
            <p className="text-sm text-muted-foreground">No available slots right now.</p>
          ) : (
            <SlotGrid slots={availableSlots} onSelect={setSelectedSlot} selectedId={selectedSlot?.slot_id} />
          )}
        </div>

        {selectedSlot && selectedVehicle && (
          <div className="mt-6 p-5 bg-accent/5 rounded-2xl border border-accent/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-foreground">Slot {selectedSlot.slot_number}</p>
                <p className="text-sm text-muted-foreground">{selectedSlot.slot_status}</p>
              </div>
              <Button onClick={handleCheckIn} disabled={saving}>
                {saving ? "Checking in..." : "Confirm Check-In"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
