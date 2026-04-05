import React, { createContext, useContext, useEffect } from "react";
import { useRouter } from "expo-router";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/auth";
import { api } from "@/lib/api";
import { signOutFromGoogle } from "@/services/google-signin.service";
import { User } from "@/types/user";

interface AuthContextData {
  user: User | undefined;
  api_token: string;
  abilities: number[];
  isLoading: boolean;
  login: (user: User, token: string, abilities: number[]) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const {
    user,
    api_token,
    abilities,
    isLoading,
    isBootstrapping,
    setSession,
    clearSession,
    initialize,
  } = useAuthStore();

  const queryClient = useQueryClient();
  const router = useRouter();

  useEffect(() => {
    initialize();
  }, []);

  const login = (user: User, token: string, abilities: number[]) => {
    setSession(user, token, abilities);
    router.replace("/(tabs)");
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } finally {
      clearSession();
      queryClient.clear();
      signOutFromGoogle().catch(() => {});
    }
  };

  if (isBootstrapping) {
    return null;
  }

  return (
    <AuthContext.Provider
      value={{ user, api_token, abilities, isLoading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  }
  return context;
}
