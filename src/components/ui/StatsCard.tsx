import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  color?: "blue" | "cyan" | "green" | "amber" | "red";
}

const colorMap = {
  blue: { bg: "bg-blue-500/10", icon: "text-blue-500", ring: "ring-blue-500/20" },
  cyan: { bg: "bg-cyan-500/10", icon: "text-cyan-500", ring: "ring-cyan-500/20" },
  green: { bg: "bg-emerald-500/10", icon: "text-emerald-500", ring: "ring-emerald-500/20" },
  amber: { bg: "bg-amber-500/10", icon: "text-amber-500", ring: "ring-amber-500/20" },
  red: { bg: "bg-red-500/10", icon: "text-red-500", ring: "ring-red-500/20" },
};

export default function StatsCard({ title, value, icon: Icon, description, color = "blue" }: StatsCardProps) {
  const c = colorMap[color];
  return (
    <div className="bg-card rounded-2xl border border-border p-5 hover:shadow-lg transition-all duration-300 group">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{title}</p>
          <p className="text-3xl font-bold text-foreground tracking-tight">{value}</p>
          {description && <p className="text-xs text-muted-foreground">{description}</p>}
        </div>
        <div className={`p-3 rounded-xl ${c.bg} ring-1 ${c.ring} group-hover:scale-110 transition-transform duration-300`}>
          <Icon className={`w-5 h-5 ${c.icon}`} />
        </div>
      </div>
    </div>
  );
}
