import React from "react";
import { View, StyleSheet } from "react-native";
import { theme } from "@theme";
import { Text } from "../Text";

interface InputWrapperProps {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export function InputWrapper({ label, error, icon, children }: InputWrapperProps) {
  return (
    <View style={styles.container}>
      {label && (
        <Text type="small" color="gray" style={styles.label}>
          {label}
        </Text>
      )}
      <View style={styles.inputRow}>
        {icon && <View style={styles.icon}>{icon}</View>}
        <View style={styles.flex}>{children}</View>
      </View>
      {error && (
        <Text type="small" color="danger" style={styles.error}>
          {error}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 6,
  },
  label: {
    marginLeft: 4,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    position: "absolute",
    left: 12,
    zIndex: 1,
  },
  flex: {
    flex: 1,
  },
  error: {
    marginLeft: 4,
  },
});

export const inputBaseStyles = StyleSheet.create({
  input: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: theme.border.gray,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: theme.colors.white,
    fontFamily: theme.fonts.body,
    fontSize: 14,
  },
  focused: {
    borderColor: theme.colors.secundary,
  },
  error: {
    borderColor: theme.colors.danger,
  },
  withIcon: {
    paddingLeft: 44,
  },
});
