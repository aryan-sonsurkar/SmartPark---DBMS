"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Car, Menu, X, LogOut, User } from "lucide-react";
import { useState } from "react";
import { mockUser } from "@/lib/mock-data";
import ThemeToggle from "@/components/ui/ThemeToggle";

const navLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/parking", label: "Parking" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const user = mockUser;

  return (
    <nav className="glass border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center shadow-lg shadow-accent/20 group-hover:shadow-accent/40 transition-shadow">
              <Car className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight">
              <span className="gradient-text">Smart</span>
              <span className="text-foreground">Park</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1 bg-surface rounded-xl p-1 border border-border">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  pathname === link.href
                    ? "bg-accent text-white shadow-lg shadow-accent/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-card"
                }`}
              >
                {link.label}
              </Link>
            ))}
            {user.role === "admin" && (
              <Link
                href="/admin"
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  pathname.startsWith("/admin")
                    ? "bg-accent text-white shadow-lg shadow-accent/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-card"
                }`}
              >
                Admin
              </Link>
            )}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            <div className="h-6 w-px bg-border" />
            <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-surface border border-border">
              <div className="w-7 h-7 rounded-lg gradient-bg flex items-center justify-center">
                <User className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-sm font-medium">{user.full_name}</span>
            </div>
            <button className="p-2.5 rounded-xl hover:bg-surface text-muted-foreground hover:text-foreground transition-colors border border-transparent hover:border-border">
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2.5 rounded-xl hover:bg-surface border border-border">
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-card">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`block px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  pathname === link.href ? "bg-accent text-white" : "text-muted-foreground hover:bg-surface"
                }`}
              >
                {link.label}
              </Link>
            ))}
            {user.role === "admin" && (
              <Link
                href="/admin"
                onClick={() => setMobileOpen(false)}
                className={`block px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  pathname.startsWith("/admin") ? "bg-accent text-white" : "text-muted-foreground hover:bg-surface"
                }`}
              >
                Admin
              </Link>
            )}
            <div className="pt-2">
              <ThemeToggle />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
