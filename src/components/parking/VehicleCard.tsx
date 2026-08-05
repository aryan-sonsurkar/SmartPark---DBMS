import type { Vehicle } from "@/types";
import { Car, Bike, Truck, SquareParking } from "lucide-react";

interface VehicleCardProps {
  vehicle: Vehicle;
  actions?: React.ReactNode;
}

const typeIcons: Record<string, typeof Car> = {
  Car: Car,
  Bike: Bike,
  Truck: Truck,
  SUV: SquareParking,
};

const typeColors: Record<string, string> = {
  Car: "bg-blue-500/10 text-blue-500 ring-blue-500/20",
  Bike: "bg-violet-500/10 text-violet-500 ring-violet-500/20",
  Truck: "bg-amber-500/10 text-amber-500 ring-amber-500/20",
  SUV: "bg-emerald-500/10 text-emerald-500 ring-emerald-500/20",
};

export default function VehicleCard({ vehicle, actions }: VehicleCardProps) {
  const Icon = typeIcons[vehicle.vehicle_type] || Car;
  const color = typeColors[vehicle.vehicle_type] || typeColors.Car;

  return (
    <div className="bg-card rounded-2xl border border-border p-5 hover:shadow-lg hover:border-accent/20 transition-all duration-300 group">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className={`p-2.5 rounded-xl ring-1 ${color} group-hover:scale-110 transition-transform duration-300`}>
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-foreground tracking-tight font-mono">{vehicle.vehicle_number}</h3>
            <p className="text-sm text-muted-foreground mt-0.5">
              {vehicle.owner?.owner_name || `Owner #${vehicle.owner_id}`}
            </p>
          </div>
        </div>
        {actions}
      </div>
      <div className="mt-4 flex items-center gap-2">
        <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest bg-surface border border-border text-muted-foreground">
          {vehicle.vehicle_type}
        </span>
      </div>
    </div>
  );
}
