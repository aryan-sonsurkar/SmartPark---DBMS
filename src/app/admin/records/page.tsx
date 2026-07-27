"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { mockRecords } from "@/lib/mock-data";

export default function AdminRecordsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = mockRecords.filter((r) => {
    const matchesSearch =
      r.vehicle?.plate_number?.toLowerCase().includes(search.toLowerCase()) ||
      r.slot?.slot_number?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
              placeholder="Search by plate number or slot..."
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
                <th className="px-5 py-3 font-bold">Vehicle</th>
                <th className="px-5 py-3 font-bold">Slot</th>
                <th className="px-5 py-3 font-bold">Entry Time</th>
                <th className="px-5 py-3 font-bold">Exit Time</th>
                <th className="px-5 py-3 font-bold">Duration</th>
                <th className="px-5 py-3 font-bold">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => {
                const entry = new Date(r.entry_time);
                const exit = r.exit_time ? new Date(r.exit_time) : new Date();
                const durationMs = exit.getTime() - entry.getTime();
                const hours = Math.floor(durationMs / (1000 * 60 * 60));
                const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));

                return (
                  <tr key={r.id} className="border-b border-border/50 hover:bg-surface transition-colors">
                    <td className="px-5 py-3.5 font-bold text-foreground font-mono text-sm">{r.vehicle?.plate_number}</td>
                    <td className="px-5 py-3.5 text-muted-foreground text-sm">{r.slot?.slot_number}</td>
                    <td className="px-5 py-3.5 text-muted-foreground text-sm">{entry.toLocaleString()}</td>
                    <td className="px-5 py-3.5 text-muted-foreground text-sm">
                      {r.exit_time ? new Date(r.exit_time).toLocaleString() : "-"}
                    </td>
                    <td className="px-5 py-3.5 text-muted-foreground text-sm">
                      {hours > 0 ? `${hours}h ` : ""}
                      {minutes}m
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest ${
                          r.status === "active"
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                            : "bg-surface border border-border text-muted-foreground"
                        }`}
                      >
                        {r.status}
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
