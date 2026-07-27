import type { ParkingSlot } from "@/types";

interface SlotGridProps {
  slots: ParkingSlot[];
  onSelect?: (slot: ParkingSlot) => void;
  selectedId?: string;
}

const statusStyles = {
  available: "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 cursor-pointer hover:shadow-lg hover:shadow-emerald-500/10",
  occupied: "bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400 cursor-not-allowed opacity-60",
  maintenance: "bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400 cursor-not-allowed",
};

const typeEmoji: Record<string, string> = {
  compact: "🏍",
  standard: "🚗",
  large: "🚛",
};

export default function SlotGrid({ slots, onSelect, selectedId }: SlotGridProps) {
  const floors = Array.from(new Set(slots.map((s) => s.floor))).sort();

  return (
    <div className="space-y-6">
      {floors.map((floor) => (
        <div key={floor}>
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3 flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-surface border border-border flex items-center justify-center text-[10px] font-bold">
              {floor}
            </span>
            Floor {floor}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {slots
              .filter((s) => s.floor === floor)
              .sort((a, b) => a.slot_number.localeCompare(b.slot_number))
              .map((slot) => (
                <button
                  key={slot.id}
                  onClick={() => slot.status === "available" && onSelect?.(slot)}
                  disabled={slot.status !== "available"}
                  className={`relative p-4 rounded-2xl border-2 text-center transition-all duration-200 ${
                    selectedId === slot.id
                      ? "border-accent bg-accent/10 ring-4 ring-accent/20 scale-[1.02]"
                      : statusStyles[slot.status]
                  }`}
                >
                  {selectedId === slot.id && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full gradient-bg flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                  <div className="text-3xl mb-2">{typeEmoji[slot.slot_type]}</div>
                  <div className="font-bold text-sm tracking-wide">{slot.slot_number}</div>
                  <div className="text-[10px] mt-1 uppercase tracking-wider opacity-70">{slot.slot_type}</div>
                </button>
              ))}
          </div>
        </div>
      ))}

      <div className="flex items-center gap-5 pt-4 border-t border-border">
        {[
          { color: "bg-emerald-500", label: "Available" },
          { color: "bg-red-500", label: "Occupied" },
          { color: "bg-amber-500", label: "Maintenance" },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-2 text-xs">
            <div className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
            <span className="text-muted-foreground font-medium">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
