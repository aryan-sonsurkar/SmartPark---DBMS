import { Car, MapPin, Users, CreditCard } from "lucide-react";
import StatsCard from "@/components/ui/StatsCard";
import { mockVehicles, mockSlots, mockRecords, mockPayments } from "@/lib/mock-data";

export default function AdminDashboardPage() {
  const activeRecords = mockRecords.filter((r) => r.status === "active");
  const totalRevenue = mockPayments.reduce((sum, p) => sum + p.amount, 0);
  const availableSlots = mockSlots.filter((s) => s.status === "available").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1 text-sm">Overview of the parking management system.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Total Vehicles" value={mockVehicles.length} icon={Car} color="blue" />
        <StatsCard title="Active Sessions" value={activeRecords.length} icon={MapPin} color="cyan" />
        <StatsCard title="Available Slots" value={`${availableSlots}/${mockSlots.length}`} icon={MapPin} color="green" />
        <StatsCard title="Total Revenue" value={`₹${totalRevenue}`} icon={CreditCard} color="amber" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-2xl border border-border p-6">
          <h2 className="text-base font-bold text-foreground mb-4 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Active Parking Sessions
          </h2>
          <div className="space-y-3">
            {activeRecords.map((record) => (
              <div key={record.id} className="flex items-center justify-between p-3.5 bg-surface rounded-xl border border-border hover:border-accent/20 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                    <Car className="w-4 h-4 text-emerald-500" />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-foreground font-mono">{record.vehicle?.plate_number}</p>
                    <p className="text-xs text-muted-foreground">
                      Slot {record.slot?.slot_number} &middot; Floor {record.slot?.floor}
                    </p>
                  </div>
                </div>
                <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  Active
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card rounded-2xl border border-border p-6">
          <h2 className="text-base font-bold text-foreground mb-4 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-accent" />
            Recent Payments
          </h2>
          <div className="space-y-3">
            {mockPayments.map((payment) => (
              <div key={payment.id} className="flex items-center justify-between p-3.5 bg-surface rounded-xl border border-border">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                    <CreditCard className="w-4 h-4 text-accent" />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-foreground">₹{payment.amount}</p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {payment.payment_method} &middot; {new Date(payment.paid_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest bg-accent/10 text-accent">
                  Paid
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
