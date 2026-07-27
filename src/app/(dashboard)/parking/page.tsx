"use client";

import { useState } from "react";
import SlotGrid from "@/components/parking/SlotGrid";
import { mockSlots } from "@/lib/mock-data";
import type { ParkingSlot } from "@/types";

export default function ParkingPage() {
  const [slots] = useState<ParkingSlot[]>(mockSlots);

  const available = slots.filter((s) => s.status === "available").length;
  const occupied = slots.filter((s) => s.status === "occupied").length;
  const maintenance = slots.filter((s) => s.status === "maintenance").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Parking Map</h1>
        <p className="text-muted-foreground mt-1 text-sm">Live view of all parking slots across floors.</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-card rounded-2xl border border-border p-4 text-center">
          <p className="text-3xl font-bold text-emerald-500">{available}</p>
          <p className="text-xs text-muted-foreground font-medium mt-1 uppercase tracking-wider">Available</p>
        </div>
        <div className="bg-card rounded-2xl border border-border p-4 text-center">
          <p className="text-3xl font-bold text-red-500">{occupied}</p>
          <p className="text-xs text-muted-foreground font-medium mt-1 uppercase tracking-wider">Occupied</p>
        </div>
        <div className="bg-card rounded-2xl border border-border p-4 text-center">
          <p className="text-3xl font-bold text-amber-500">{maintenance}</p>
          <p className="text-xs text-muted-foreground font-medium mt-1 uppercase tracking-wider">Maintenance</p>
        </div>
      </div>

      <div className="bg-card rounded-2xl border border-border p-6">
        <SlotGrid slots={slots} />
      </div>
    </div>
  );
}
