"use client";

import { useState } from "react";
import { Search, Pencil, Trash2, Plus } from "lucide-react";
import Button from "@/components/ui/Button";
import { mockVehicles } from "@/lib/mock-data";
import type { Vehicle } from "@/types";

export default function AdminVehiclesPage() {
  const [search, setSearch] = useState("");
  const [vehicles] = useState<Vehicle[]>(mockVehicles);

  const filtered = vehicles.filter(
    (v) =>
      v.plate_number.toLowerCase().includes(search.toLowerCase()) ||
      v.model.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">All Vehicles</h1>
          <p className="text-muted-foreground mt-1 text-sm">Manage all registered vehicles in the system.</p>
        </div>
        <Button>
          <Plus className="w-4 h-4" /> Add Vehicle
        </Button>
      </div>

      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="p-4 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by plate number or model..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-surface border border-border rounded-xl focus:border-accent focus:ring-2 focus:ring-accent/20 focus:outline-none transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-muted-foreground border-b border-border uppercase tracking-wider">
                <th className="px-5 py-3 font-bold">Plate Number</th>
                <th className="px-5 py-3 font-bold">Model</th>
                <th className="px-5 py-3 font-bold">Color</th>
                <th className="px-5 py-3 font-bold">Type</th>
                <th className="px-5 py-3 font-bold">Registered</th>
                <th className="px-5 py-3 font-bold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((v) => (
                <tr key={v.id} className="border-b border-border/50 hover:bg-surface transition-colors">
                  <td className="px-5 py-3.5 font-bold text-foreground font-mono text-sm">{v.plate_number}</td>
                  <td className="px-5 py-3.5 text-muted-foreground text-sm">{v.model}</td>
                  <td className="px-5 py-3.5 text-muted-foreground text-sm">{v.color}</td>
                  <td className="px-5 py-3.5">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest bg-surface border border-border text-muted-foreground">
                      {v.vehicle_type}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-muted-foreground text-sm">{new Date(v.created_at).toLocaleDateString()}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1">
                      <button className="p-2 rounded-lg hover:bg-surface text-muted-foreground hover:text-foreground transition-colors">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button className="p-2 rounded-lg hover:bg-red-500/10 text-red-500 hover:text-red-600 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
