import { theme } from "@/theme";
import { AntDesign } from "@expo/vector-icons";
import React from "react";
import { StyleSheet } from "react-native";
import { Button } from "../Buttons";
import { Card } from "../Card";
import { RootLayout } from "../Layout/Root";
import Text from "../Text";

export type PermissionRequestProps = {
  iconName: keyof typeof AntDesign.glyphMap;
  title?: string;
  message: string;
  buttonText?: string;
  onPress: () => void;
  loading?: boolean;
};

export const PermissionRequest = ({
  iconName,
  title,
  message,
  buttonText = "Permitir",
  onPress,
  loading = false,
}: PermissionRequestProps) => {
  return (
    <RootLayout style={styles.container}>
      <Card.Header>
        <Card.Icon size="large">
          <AntDesign name={iconName} size={32} color={theme.colors.secundary} />
        </Card.Icon>
      </Card.Header>

      <Card.Content style={styles.content}>
        {title && <Text type="titulo">{title}</Text>}
        <Text type="subtitulo" style={styles.message}>
          {message}
        </Text>
      </Card.Content>

      <Button size="large" onPress={onPress} disabled={loading}>
        {loading ? "Aguarde..." : buttonText}
      </Button>
    </RootLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 24,
  },
  content: {
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  message: {
    color: theme.colors.gray,
    textAlign: "center",
  },
});
