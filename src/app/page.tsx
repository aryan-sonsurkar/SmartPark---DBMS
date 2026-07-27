"use client";

import Link from "next/link";
import { Car, MapPin, Shield, Clock, ArrowRight, Zap, ChevronRight } from "lucide-react";
import ThemeToggle from "@/components/ui/ThemeToggle";

const features = [
  {
    icon: MapPin,
    title: "Real-Time Slots",
    description: "Live floor maps with instant availability across all levels.",
    color: "text-emerald-500 bg-emerald-500/10 ring-emerald-500/20",
  },
  {
    icon: Car,
    title: "Vehicle Vault",
    description: "Register and manage your entire fleet from one dashboard.",
    color: "text-blue-500 bg-blue-500/10 ring-blue-500/20",
  },
  {
    icon: Zap,
    title: "Instant Check-In",
    description: "One-tap check-in with automatic session tracking.",
    color: "text-amber-500 bg-amber-500/10 ring-amber-500/20",
  },
  {
    icon: Shield,
    title: "Secure System",
    description: "Enterprise-grade auth and row-level security on every record.",
    color: "text-violet-500 bg-violet-500/10 ring-violet-500/20",
  },
];

const stats = [
  { label: "Parking Slots", value: "120+" },
  { label: "Floors", value: "3" },
  { label: "Vehicle Types", value: "4" },
  { label: "Active Users", value: "500+" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <nav className="glass border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center shadow-lg shadow-accent/20 group-hover:shadow-accent/40 transition-shadow">
              <Car className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight">
              <span className="gradient-text">Smart</span>
              <span className="text-foreground">Park</span>
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link href="/login" className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Login
            </Link>
            <Link
              href="/register"
              className="px-5 py-2 text-sm font-medium gradient-bg text-white rounded-xl hover:shadow-lg hover:shadow-accent/20 transition-all"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <section className="relative flex-1 flex flex-col items-center justify-center px-4 py-28 overflow-hidden">
        <div className="absolute inset-0 grid-bg" />
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-neon/5 rounded-full blur-3xl" />

        <div className="relative max-w-4xl text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface border border-border text-xs font-semibold text-muted-foreground">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Smart Parking for Smart Cities
          </div>

          <h1 className="text-5xl sm:text-7xl font-bold tracking-tight leading-[1.1]">
            Park
            <span className="gradient-text"> Smarter,</span>
            <br />
            Not Harder.
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Real-time slot discovery, instant check-in/out, and complete vehicle management.
            Built for the modern city, designed for you.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-7 py-3.5 gradient-bg text-white font-semibold rounded-2xl hover:shadow-xl hover:shadow-accent/25 transition-all duration-300 hover:-translate-y-0.5"
            >
              Start Free <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-surface border border-border text-foreground font-semibold rounded-2xl hover:bg-muted transition-all duration-300"
            >
              Sign In <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <div className="relative mt-20 w-full max-w-4xl">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-2xl glow-border">
            <div className="grid grid-cols-4 gap-2 mb-4">
              {["A1", "A2", "A3", "A4"].map((s, i) => (
                <div
                  key={s}
                  className={`p-3 rounded-xl text-center text-sm font-bold border-2 transition-all ${
                    i === 1
                      ? "bg-red-500/10 border-red-500/30 text-red-500"
                      : i === 3
                      ? "bg-amber-500/10 border-amber-500/30 text-amber-500"
                      : "bg-emerald-500/10 border-emerald-500/30 text-emerald-500"
                  }`}
                >
                  <div className="text-lg mb-1">{i === 1 ? "🚗" : i === 3 ? "🔧" : "✓"}</div>
                  {s}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-4 gap-2">
              {["B1", "B2", "B3", "B4"].map((s, i) => (
                <div
                  key={s}
                  className={`p-3 rounded-xl text-center text-sm font-bold border-2 ${
                    i === 2
                      ? "bg-red-500/10 border-red-500/30 text-red-500"
                      : "bg-emerald-500/10 border-emerald-500/30 text-emerald-500"
                  }`}
                >
                  <div className="text-lg mb-1">{i === 2 ? "🚛" : "✓"}</div>
                  {s}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Everything you need to
              <span className="gradient-text"> park smart</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              A complete parking management system built for efficiency and ease of use.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className="group p-6 rounded-2xl border border-border bg-card hover:shadow-xl hover:border-accent/20 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className={`inline-flex p-3 rounded-xl ring-1 ${f.color} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground">{f.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 border-t border-border bg-surface">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-3xl sm:text-4xl font-bold gradient-text">{s.value}</p>
              <p className="text-sm text-muted-foreground mt-1 font-medium">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="bg-card border-t border-border py-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg gradient-bg flex items-center justify-center">
              <Car className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-sm">SmartPark</span>
          </div>
          <p className="text-xs text-muted-foreground">
            DBMS Semester Project &copy; 2026 &middot; Built with Supabase + Next.js
          </p>
        </div>
      </footer>
    </div>
  );
}
