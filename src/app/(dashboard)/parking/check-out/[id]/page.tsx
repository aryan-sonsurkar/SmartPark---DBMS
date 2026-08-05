"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Clock, CreditCard, MapPin, ArrowLeft } from "lucide-react";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import { fetchRecords, checkOut, addPayment, updateSlotStatus } from "@/lib/db";
import type { ParkingRecord } from "@/types";

export default function CheckOutPage() {
  const router = useRouter();
  const [record, setRecord] = useState<ParkingRecord | null>(null);
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchRecords()
      .then((records) => {
        const active = records.find((r) => r.exit_time === null);
        setRecord(active || null);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleCheckOut = async () => {
    if (!record) return;
    setSaving(true);
    try {
      const entryTime = new Date(record.entry_time);
      const now = new Date();
      const hours = Math.ceil((now.getTime() - entryTime.getTime()) / (1000 * 60 * 60));
      const amount = hours * 50;

      // Create payment
      await addPayment({
        payment_id: `P${Date.now()}`,
        record_id: record.record_id,
        amount,
        payment_mode: paymentMethod,
      });

      // Update record exit time
      await checkOut(record.record_id);

      // Free up the slot
      await updateSlotStatus(record.slot_id, "Available");

      alert(`Payment of ₹${amount} processed. Check-out successful!`);
      router.push("/parking");
    } catch (err) {
      console.error(err);
      alert("Error during check-out");
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

  if (!record) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Check Out</h1>
        <div className="bg-card rounded-2xl border border-border p-12 text-center">
          <p className="text-muted-foreground">No active parking session found.</p>
          <Button variant="secondary" className="mt-4" onClick={() => router.push("/parking")}>
            Go to Parking Map
          </Button>
        </div>
      </div>
    );
  }

  const entryTime = new Date(record.entry_time);
  const now = new Date();
  const durationMs = now.getTime() - entryTime.getTime();
  const hours = Math.max(1, Math.ceil(durationMs / (1000 * 60 * 60)));
  const amount = hours * 50;

  return (
    <div className="space-y-6 max-w-lg">
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Check Out</h1>
        <p className="text-muted-foreground mt-1 text-sm">Review your session and confirm payment.</p>
      </div>

      <div className="bg-card rounded-2xl border border-border p-6 space-y-4">
        <div className="flex items-center gap-3 p-4 bg-surface rounded-xl border border-border">
          <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
            <MapPin className="w-5 h-5 text-accent" />
          </div>
          <div>
            <p className="font-bold text-foreground">Slot {record.slot?.slot_number}</p>
            <p className="text-sm text-muted-foreground">Record #{record.record_id}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 bg-surface rounded-xl border border-border">
          <div className="w-10 h-10 rounded-xl bg-neon/10 flex items-center justify-center">
            <Clock className="w-5 h-5 text-neon" />
          </div>
          <div>
            <p className="font-bold text-foreground">{hours}h parked</p>
            <p className="text-sm text-muted-foreground">
              Entry: {entryTime.toLocaleTimeString()} &middot; {entryTime.toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="border-t border-border pt-4 space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Vehicle</span>
            <span className="font-bold text-foreground font-mono">{record.vehicle?.vehicle_number}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Duration</span>
            <span className="font-bold text-foreground">{hours}h</span>
          </div>
          <div className="flex items-center justify-between border-t border-border pt-3">
            <span className="font-bold text-foreground">Total Amount</span>
            <span className="text-2xl font-bold gradient-text">₹{amount}</span>
          </div>
        </div>

        <Select
          label="Payment Method"
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          options={[
            { value: "UPI", label: "UPI" },
            { value: "Cash", label: "Cash" },
            { value: "Card", label: "Card" },
          ]}
        />

        <div className="flex gap-3 pt-2">
          <Button variant="ghost" onClick={() => router.back()} className="flex-1">
            <ArrowLeft className="w-4 h-4" /> Go Back
          </Button>
          <Button className="flex-1" onClick={handleCheckOut} disabled={saving}>
            <CreditCard className="w-4 h-4" /> {saving ? "Processing..." : `Pay ₹${amount}`}
          </Button>
        </div>
      </div>
    </div>
  );
}
