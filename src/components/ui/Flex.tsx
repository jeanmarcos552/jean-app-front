import React from "react";
import { View as RNView, ViewProps, StyleSheet } from "react-native";
import { theme, ThemeBackgroundKey } from "@theme";

type FlexVariant = "row" | "column" | "center";

interface Props extends ViewProps {
  variant?: FlexVariant;
  flex?: number;
  backgroundColor?: ThemeBackgroundKey;
  children?: React.ReactNode;
}

export function Flex({ variant = "column", flex = 1, backgroundColor, style, children, ...rest }: Props) {
  const bg = backgroundColor ? theme.background[backgroundColor] : undefined;

  return (
    <RNView
      style={[styles.base, styles[variant], { flex }, bg ? { backgroundColor: bg } : undefined, style]}
      {...rest}
    >
      {children}
    </RNView>
  );
}

const styles = StyleSheet.create({
  base: {
    gap: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  column: {
    flexDirection: "column",
  },
  center: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
});
