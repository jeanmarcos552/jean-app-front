import React from "react";
import { Tabs } from "expo-router";
import { Redirect } from "expo-router";
import { useAuth } from "@/contexts/authContexts";
import { Background, Border, Colors } from "@/constants/theme";
import { Icon, Label, NativeTabs } from "expo-router/unstable-native-tabs";

export default function TabLayout() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  if (!user) {
    return <Redirect href="/(auth)/signin" />;
  }

  return (
    <NativeTabs backgroundColor={Background.black} tintColor={Colors.secundary}>
      <NativeTabs.Trigger name="index">
        <Icon sf="house.fill" drawable="ic_menu_home" />
        <Label>Home</Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="perfil">
        <Icon sf="person.fill" drawable="ic_menu_profile" />
        <Label>Perfil</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
