"use client";

import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className="w-9 h-9" />;
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="relative w-9 h-9 rounded-xl bg-surface border border-border flex items-center justify-center hover:bg-muted transition-all duration-300 group"
      aria-label="Toggle theme"
    >
      <Sun
        className={`w-4 h-4 absolute transition-all duration-300 ${
          theme === "dark" ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100 text-amber-500"
        }`}
      />
      <Moon
        className={`w-4 h-4 absolute transition-all duration-300 ${
          theme === "dark" ? "rotate-0 scale-100 opacity-100 text-cyan-400" : "-rotate-90 scale-0 opacity-0"
        }`}
      />
    </button>
  );
}
