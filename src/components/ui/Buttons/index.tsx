import React, { useState } from "react";
import {
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  LayoutChangeEvent,
  ViewStyle,
  TextStyle,
} from "react-native";
import { theme } from "@theme";
import { Text } from "../Text";
import { View } from "../View";

type ButtonVariant = "default" | "outline" | "success" | "link" | "dark";
type ButtonSize = "small" | "medium" | "large" | "link";

interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  isLoading?: boolean;
  label?: string;
  color?: string;
  disabled?: boolean;
  onPress?: () => void;
  children?: React.ReactNode;
  style?: ViewStyle;
}

export function Button({
  variant = "default",
  size = "medium",
  iconLeft,
  iconRight,
  isLoading = false,
  label,
  color,
  disabled = false,
  onPress,
  children,
  style,
}: ButtonProps) {
  const [width, setWidth] = useState<number | undefined>(undefined);

  const handleLayout = (e: LayoutChangeEvent) => {
    if (!width) {
      setWidth(e.nativeEvent.layout.width);
    }
  };

  const variantStyle = variantStyles[variant];
  const sizeStyle = sizeStyles[size];
  const isDisabled = disabled || isLoading;

  const textColor = color || variantStyle.textColor;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
      onLayout={handleLayout}
      style={[
        styles.base,
        variantStyle.container,
        sizeStyle,
        isDisabled && styles.disabled,
        width && isLoading ? { width } : undefined,
        style,
      ]}
    >
      {isLoading ? (
        <ActivityIndicator color={textColor} size="small" />
      ) : (
        <View variant="row" style={styles.content}>
          {iconLeft}
          <Text style={[styles.text, sizeTextStyles[size], { color: textColor }]}>
            {label || children}
          </Text>
          {iconRight}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    gap: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontFamily: theme.fonts.titulo,
    fontWeight: "600",
  },
  disabled: {
    opacity: 0.5,
  },
});

const variantStyles: Record<ButtonVariant, { container: ViewStyle; textColor: string }> = {
  default: {
    container: {
      backgroundColor: theme.colors.secundary,
    },
    textColor: "#fff",
  },
  outline: {
    container: {
      backgroundColor: "transparent",
      borderWidth: 1,
      borderColor: theme.border.gray,
    },
    textColor: theme.colors.white,
  },
  success: {
    container: {
      backgroundColor: theme.colors.success,
    },
    textColor: "#fff",
  },
  link: {
    container: {
      backgroundColor: "transparent",
    },
    textColor: theme.colors.secundary,
  },
  dark: {
    container: {
      backgroundColor: theme.background.black,
      borderWidth: 1,
      borderColor: theme.border.black,
    },
    textColor: theme.colors.white,
  },
};

const sizeStyles: Record<ButtonSize, ViewStyle> = {
  small: { paddingVertical: 8, paddingHorizontal: 16 },
  medium: { paddingVertical: 12, paddingHorizontal: 20 },
  large: { paddingVertical: 16, paddingHorizontal: 24 },
  link: { paddingVertical: 4, paddingHorizontal: 0 },
};

const sizeTextStyles: Record<ButtonSize, TextStyle> = {
  small: { fontSize: 12 },
  medium: { fontSize: 14 },
  large: { fontSize: 16 },
  link: { fontSize: 14, textDecorationLine: "underline" },
};
