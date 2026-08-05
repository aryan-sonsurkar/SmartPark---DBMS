"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/lib/supabase";

interface AppUser {
  user_id: number;
  username: string;
  full_name: string;
  role: "admin" | "user";
  owner_id?: number;
}

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<{ error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => ({}),
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("smartpark_user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem("smartpark_user");
      }
    }
    setLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    const { data, error } = await supabase
      .from("app_user")
      .select("user_id, username, full_name, role, owner_id")
      .eq("username", username)
      .eq("password", password)
      .single();

    if (error || !data) {
      return { error: "Invalid username or password" };
    }

    setUser(data);
    localStorage.setItem("smartpark_user", JSON.stringify(data));
    return {};
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("smartpark_user");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
