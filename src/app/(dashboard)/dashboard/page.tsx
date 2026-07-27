import { Car, MapPin, Clock, CreditCard } from "lucide-react";
import StatsCard from "@/components/ui/StatsCard";
import { mockVehicles, mockRecords } from "@/lib/mock-data";

const activeRecords = mockRecords.filter((r) => r.status === "active");
const completedRecords = mockRecords.filter((r) => r.status === "completed");

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1 text-sm">Welcome back, Aryan. Here&apos;s your parking overview.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="My Vehicles" value={mockVehicles.length} icon={Car} color="blue" />
        <StatsCard title="Active Parking" value={activeRecords.length} icon={MapPin} color="cyan" />
        <StatsCard title="Total Sessions" value={mockRecords.length} icon={Clock} color="green" />
        <StatsCard title="Total Spent" value="₹250" icon={CreditCard} color="amber" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-2xl border border-border p-6">
          <h2 className="text-base font-bold text-foreground mb-4 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Active Sessions
          </h2>
          {activeRecords.length === 0 ? (
            <p className="text-sm text-muted-foreground">No active parking sessions.</p>
          ) : (
            <div className="space-y-3">
              {activeRecords.map((record) => (
                <div key={record.id} className="flex items-center justify-between p-3.5 bg-surface rounded-xl border border-border hover:border-accent/20 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-emerald-500" />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-foreground font-mono">{record.vehicle?.plate_number}</p>
                      <p className="text-xs text-muted-foreground">Slot {record.slot?.slot_number} &middot; Floor {record.slot?.floor}</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    Active
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-card rounded-2xl border border-border p-6">
          <h2 className="text-base font-bold text-foreground mb-4 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-muted-foreground/50" />
            Recent Activity
          </h2>
          {completedRecords.length === 0 ? (
            <p className="text-sm text-muted-foreground">No completed sessions yet.</p>
          ) : (
            <div className="space-y-3">
              {completedRecords.map((record) => (
                <div key={record.id} className="flex items-center justify-between p-3.5 bg-surface rounded-xl border border-border">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-surface border border-border flex items-center justify-center">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-foreground font-mono">{record.vehicle?.plate_number}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(record.entry_time).toLocaleDateString()} &middot; Slot {record.slot?.slot_number}
                      </p>
                    </div>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest bg-surface border border-border text-muted-foreground">
                    Done
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
