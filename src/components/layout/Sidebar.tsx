"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Car, MapPin, History, Settings, Shield } from "lucide-react";

const userLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/vehicles", label: "My Vehicles", icon: Car },
  { href: "/parking", label: "Parking Map", icon: MapPin },
  { href: "/parking/check-in", label: "Check In", icon: MapPin },
];

const adminLinks = [
  { href: "/admin", label: "Overview", icon: Shield },
  { href: "/admin/vehicles", label: "All Vehicles", icon: Car },
  { href: "/admin/records", label: "Records", icon: History },
  { href: "/admin/slots", label: "Manage Slots", icon: Settings },
];

export default function Sidebar({ isAdmin = false }: { isAdmin?: boolean }) {
  const pathname = usePathname();
  const links = isAdmin ? adminLinks : userLinks;

  return (
    <aside className="w-64 bg-card border-r border-border min-h-[calc(100vh-4rem)] p-3 hidden lg:block">
      <div className="space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive =
            pathname === link.href ||
            (link.href !== "/dashboard" && link.href !== "/admin" && pathname.startsWith(link.href));
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-accent/10 text-accent ring-1 ring-accent/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-surface"
              }`}
            >
              <Icon className="w-4 h-4" />
              {link.label}
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
