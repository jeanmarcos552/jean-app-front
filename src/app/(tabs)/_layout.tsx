import React from "react";
import { Tabs } from "expo-router";
import { Redirect } from "expo-router";
import { useAuth } from "@/contexts/authContexts";
import { Background, Border, Colors } from "@/constants/theme";

export default function TabLayout() {
  const { user } = useAuth();

  if (!user) {
    return <Redirect href="/(auth)/signin" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Background.black,
          borderTopColor: Border.black,
          borderTopWidth: 1,
        },
        tabBarActiveTintColor: Colors.secundary,
        tabBarInactiveTintColor: Colors.gray,
        tabBarLabelStyle: {
          fontFamily: "Montserrat-Medium",
          fontSize: 11,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: "Perfil",
        }}
      />
    </Tabs>
  );
}
