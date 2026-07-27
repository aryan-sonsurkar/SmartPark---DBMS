"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Clock, CreditCard, MapPin, ArrowLeft } from "lucide-react";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import { mockRecords } from "@/lib/mock-data";

export default function CheckOutPage() {
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState("upi");

  const activeRecord = mockRecords.find((r) => r.status === "active");

  if (!activeRecord) {
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

  const entryTime = new Date(activeRecord.entry_time);
  const now = new Date();
  const durationMs = now.getTime() - entryTime.getTime();
  const hours = Math.floor(durationMs / (1000 * 60 * 60));
  const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
  const amount = hours * 50 + (minutes > 0 ? 50 : 0);

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
            <p className="font-bold text-foreground">Slot {activeRecord.slot?.slot_number}</p>
            <p className="text-sm text-muted-foreground">Floor {activeRecord.slot?.floor}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 bg-surface rounded-xl border border-border">
          <div className="w-10 h-10 rounded-xl bg-neon/10 flex items-center justify-center">
            <Clock className="w-5 h-5 text-neon" />
          </div>
          <div>
            <p className="font-bold text-foreground">
              {hours}h {minutes}m
            </p>
            <p className="text-sm text-muted-foreground">
              Entry: {entryTime.toLocaleTimeString()} &middot; {entryTime.toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="border-t border-border pt-4 space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Vehicle</span>
            <span className="font-bold text-foreground font-mono">{activeRecord.vehicle?.plate_number}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Duration</span>
            <span className="font-bold text-foreground">
              {hours > 0 ? `${hours}h ` : ""}
              {minutes}m
            </span>
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
            { value: "upi", label: "UPI" },
            { value: "cash", label: "Cash" },
            { value: "card", label: "Card" },
          ]}
        />

        <div className="flex gap-3 pt-2">
          <Button variant="ghost" onClick={() => router.back()} className="flex-1">
            <ArrowLeft className="w-4 h-4" /> Go Back
          </Button>
          <Button className="flex-1">
            <CreditCard className="w-4 h-4" /> Pay ₹{amount}
          </Button>
        </div>
      </div>
    </div>
  );
}
