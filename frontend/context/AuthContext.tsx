"use client";

import { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import api from "@/lib/api";
import { getToken, removeToken, saveToken } from "@/lib/auth";
import type { AuthResponse, LoginRequest, RegisterRequest, UserResponse } from "@/lib/types";

interface AuthContextValue {
  user: UserResponse | null;
  loading: boolean;
  login: (payload: LoginRequest) => Promise<void>;
  register: (payload: RegisterRequest) => Promise<void>;
  logout: () => void;
  /** Call after saving profile to sync user state in context */
  refreshUser: () => Promise<void>;
  /** Update local user state without a network call */
  setUser: (u: UserResponse | null) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchCurrentUser = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const response = await api.get<UserResponse>("/auth/me");
      setUser(response.data);
    } catch {
      removeToken();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchCurrentUser();
  }, [fetchCurrentUser]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      setUser,
      refreshUser: async () => {
        try {
          const response = await api.get<UserResponse>("/auth/me");
          setUser(response.data);
        } catch {
          /* silently ignore */
        }
      },
      login: async (payload: LoginRequest) => {
        const response = await api.post<AuthResponse>("/auth/login", payload);
        saveToken(response.data.token);
        setUser(response.data.user);
      },
      register: async (payload: RegisterRequest) => {
        const response = await api.post<AuthResponse>("/auth/register", payload);
        saveToken(response.data.token);
        setUser(response.data.user);
      },
      logout: () => {
        removeToken();
        setUser(null);
      },
    }),
    [user, loading, fetchCurrentUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
