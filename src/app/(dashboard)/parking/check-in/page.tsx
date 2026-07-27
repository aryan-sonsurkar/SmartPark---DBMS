"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import SlotGrid from "@/components/parking/SlotGrid";
import { mockVehicles, mockSlots } from "@/lib/mock-data";
import type { ParkingSlot } from "@/types";

export default function CheckInPage() {
  const router = useRouter();
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [selectedSlot, setSelectedSlot] = useState<ParkingSlot | null>(null);

  const vehicleOptions = mockVehicles.map((v) => ({
    value: v.id,
    label: `${v.plate_number} - ${v.model}`,
  }));

  const availableSlots = mockSlots.filter((s) => s.status === "available");

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
          <SlotGrid slots={availableSlots} onSelect={setSelectedSlot} selectedId={selectedSlot?.id} />
        </div>

        {selectedSlot && selectedVehicle && (
          <div className="mt-6 p-5 bg-accent/5 rounded-2xl border border-accent/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-foreground">
                  Slot {selectedSlot.slot_number} (Floor {selectedSlot.floor})
                </p>
                <p className="text-sm text-muted-foreground capitalize">{selectedSlot.slot_type} slot</p>
              </div>
              <Button onClick={() => router.push("/parking/check-out/dummy-id")}>Confirm Check-In</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
