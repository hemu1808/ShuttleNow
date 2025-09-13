import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

export interface User { id: string; token: string; }
interface Decoded { exp?: number; user?: { id: string } }

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode<Decoded>(token);
        const valid = decoded?.exp ? decoded.exp * 1000 > Date.now() : true;
        if (valid && decoded?.user?.id) {
          setUser({ id: decoded.user.id, token });
          axios.defaults.headers.common.Authorization = `Bearer ${token}`;
        } else {
          localStorage.removeItem("token");
        }
      } catch {
        localStorage.removeItem("token");
      }
    }
    setLoading(false);
  }, []);

  const login = (token: string) => {
    localStorage.setItem("token", token);
    const decoded = jwtDecode<Decoded>(token);
    setUser({ id: decoded?.user?.id ?? "", token });
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    delete axios.defaults.headers.common.Authorization;
  };

  const value = useMemo(() => ({ user, isAuthenticated: !!user, loading, login, logout }), [user, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
