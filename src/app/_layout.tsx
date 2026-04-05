import React, { useEffect } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/contexts/authContexts";
import { useCustomFonts } from "@/hooks/use-custom-fonts";
import { configureGoogleSignIn } from "@/services/google-signin.service";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5,
    },
  },
});

export default function Layout() {
  const { loaded } = useCustomFonts();

  useEffect(() => {
    configureGoogleSignIn();
  }, []);

  if (!loaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <StatusBar style="light" />
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="(auth)/signin" />
            <Stack.Screen name="(auth)/email-senha" />
            <Stack.Screen name="(auth)/cadastro" />
            <Stack.Screen name="goals/criar" />
            <Stack.Screen name="goals/[id]" />
            <Stack.Screen name="goals/editar" />
            <Stack.Screen name="goals/convidar" />
            <Stack.Screen name="goals/pix" />
          </Stack>
        </AuthProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
