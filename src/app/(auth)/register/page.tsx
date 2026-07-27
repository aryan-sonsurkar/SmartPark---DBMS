"use client";

import Link from "next/link";
import { useState } from "react";
import { Car, Mail, Lock, User, Phone } from "lucide-react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import ThemeToggle from "@/components/ui/ThemeToggle";

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 relative overflow-hidden">
      <div className="absolute inset-0 grid-bg" />
      <div className="absolute top-0 right-1/3 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-neon/5 rounded-full blur-3xl" />

      <div className="relative w-full max-w-md space-y-6">
        <div className="flex justify-end">
          <ThemeToggle />
        </div>

        <div className="text-center space-y-3">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl gradient-bg flex items-center justify-center shadow-lg shadow-accent/20">
              <Car className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold">
              <span className="gradient-text">Smart</span>
              <span className="text-foreground">Park</span>
            </span>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Create your account</h1>
            <p className="text-sm text-muted-foreground mt-1">Join SmartPark and start parking smarter</p>
          </div>
        </div>

        <div className="bg-card rounded-2xl border border-border p-8 shadow-xl glow-border">
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div className="relative">
              <User className="absolute left-3.5 top-[38px] w-4 h-4 text-muted-foreground" />
              <Input
                label="Full Name"
                id="name"
                placeholder="John Doe"
                className="pl-10"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="relative">
              <Mail className="absolute left-3.5 top-[38px] w-4 h-4 text-muted-foreground" />
              <Input
                label="Email"
                type="email"
                id="email"
                placeholder="you@example.com"
                className="pl-10"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div className="relative">
              <Phone className="absolute left-3.5 top-[38px] w-4 h-4 text-muted-foreground" />
              <Input
                label="Phone"
                type="tel"
                id="phone"
                placeholder="+91 98765 43210"
                className="pl-10"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-[38px] w-4 h-4 text-muted-foreground" />
              <Input
                label="Password"
                type="password"
                id="password"
                placeholder="Create a password"
                className="pl-10"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>
            <Button type="submit" className="w-full mt-2">
              Create Account
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-border text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="text-accent hover:text-accent/80 font-semibold">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
