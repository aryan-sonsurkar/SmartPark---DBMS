"use client";

import { useState, useEffect } from "react";
import SlotGrid from "@/components/parking/SlotGrid";
import { fetchSlots } from "@/lib/db";
import { supabase } from "@/lib/supabase";
import type { ParkingSlot } from "@/types";

export default function ParkingPage() {
  const [slots, setSlots] = useState<ParkingSlot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSlots()
      .then(setSlots)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel("parking_slot_changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "parking_slot" }, (payload) => {
        if (payload.eventType === "UPDATE") {
          setSlots((prev) => prev.map((s) => (s.slot_id === payload.new.slot_id ? payload.new as ParkingSlot : s)));
        } else if (payload.eventType === "INSERT") {
          setSlots((prev) => [...prev, payload.new as ParkingSlot]);
        } else if (payload.eventType === "DELETE") {
          setSlots((prev) => prev.filter((s) => s.slot_id !== payload.old.slot_id));
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const available = slots.filter((s) => s.slot_status === "Available").length;
  const occupied = slots.filter((s) => s.slot_status === "Occupied").length;
  const maintenance = slots.filter((s) => s.slot_status === "Maintenance").length;

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
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Parking Map</h1>
        <p className="text-muted-foreground mt-1 text-sm">Live view of all parking slots. Updates in real-time.</p>
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
