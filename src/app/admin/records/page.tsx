"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { fetchRecords } from "@/lib/db";
import type { ParkingRecord } from "@/types";

export default function AdminRecordsPage() {
  const [records, setRecords] = useState<ParkingRecord[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecords()
      .then(setRecords)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = records.filter((r) => {
    const matchesSearch =
      r.vehicle?.vehicle_number?.toLowerCase().includes(search.toLowerCase()) ||
      r.slot?.slot_number?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && r.exit_time === null) ||
      (statusFilter === "completed" && r.exit_time !== null);
    return matchesSearch && matchesStatus;
  });

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
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Parking Records</h1>
        <p className="text-muted-foreground mt-1 text-sm">View all parking sessions and payment history.</p>
      </div>

      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by vehicle number or slot..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-surface border border-border rounded-xl focus:border-accent focus:ring-2 focus:ring-accent/20 focus:outline-none transition-all"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 text-sm bg-surface border border-border rounded-xl focus:border-accent focus:outline-none"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-muted-foreground border-b border-border uppercase tracking-wider">
                <th className="px-5 py-3 font-bold">Record ID</th>
                <th className="px-5 py-3 font-bold">Vehicle</th>
                <th className="px-5 py-3 font-bold">Slot</th>
                <th className="px-5 py-3 font-bold">Entry Time</th>
                <th className="px-5 py-3 font-bold">Exit Time</th>
                <th className="px-5 py-3 font-bold">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => {
                const isActive = r.exit_time === null;
                return (
                  <tr key={r.record_id} className="border-b border-border/50 hover:bg-surface transition-colors">
                    <td className="px-5 py-3.5 font-bold text-foreground font-mono text-sm">#{r.record_id}</td>
                    <td className="px-5 py-3.5 font-bold text-foreground font-mono text-sm">{r.vehicle?.vehicle_number}</td>
                    <td className="px-5 py-3.5 text-muted-foreground text-sm">{r.slot?.slot_number}</td>
                    <td className="px-5 py-3.5 text-muted-foreground text-sm">{new Date(r.entry_time).toLocaleString()}</td>
                    <td className="px-5 py-3.5 text-muted-foreground text-sm">
                      {r.exit_time ? new Date(r.exit_time).toLocaleString() : "-"}
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest ${
                          isActive
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                            : "bg-surface border border-border text-muted-foreground"
                        }`}
                      >
                        {isActive ? "Active" : "Completed"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
