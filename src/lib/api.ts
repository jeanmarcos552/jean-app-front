import axios from "axios";
import { useAuthStore } from "@/stores/auth";
import { router } from "expo-router";

export const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// Request interceptor: adiciona token
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().api_token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: trata 401
let redirectTimeout: ReturnType<typeof setTimeout> | null = null;

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().clearSession();

      if (!redirectTimeout) {
        redirectTimeout = setTimeout(() => {
          redirectTimeout = null;
          router.replace("/(auth)/signin");
        }, 100);
      }
    }
    return Promise.reject(error);
  }
);

// Tipos de erro da API
export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details: string[];
  };
}

interface ValidationError {
  message: string;
  errors: Record<string, string[]>;
}

// Extrai mensagem de erro da resposta
export function getApiErrorMessage(error: any): string {
  console.log(error)
  if (axios.isAxiosError(error) && error.response?.data) {
    const data = error.response.data;

    // Erro padrão da API
    if (data.error?.message) {
      return data.error.message;
    }

    // Erro de validação 422
    if (data.errors) {
      const firstField = Object.keys(data.errors)[0];
      if (firstField && data.errors[firstField]?.[0]) {
        return data.errors[firstField][0];
      }
    }

    // Mensagem genérica
    if (data.message) {
      return data.message;
    }
  }

  return "Ocorreu um erro inesperado. Tente novamente.";
}
