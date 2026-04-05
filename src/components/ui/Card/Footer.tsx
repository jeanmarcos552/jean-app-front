import { BackgroundType } from "@/theme";
import React from "react";
import {
  PressableProps,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";

export type CardVariant = BackgroundType;
export type CardProps = PressableProps & {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  alignment?: "start" | "center" | "end" | "default";
};
export const Footer = ({
  children,
  style,
  alignment = "default",
  ...rest
}: CardProps) => {
  return (
    <View style={[styles.footer, alignmentStyles[alignment], style]} {...rest}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    borderTopWidth: 0.5,
    gap: 8,
    alignItems: "center",
    flexDirection: "row",
    borderRadius: 4,
    borderTopColor: "#ffffff77",
    paddingTop: 10,
    width: "100%",
    flex: 1,
  },
});

const alignmentStyles = StyleSheet.create({
  start: {
    justifyContent: "flex-start",
  },
  center: {
    justifyContent: "center",
  },
  end: {
    justifyContent: "flex-end",
  },
  default: {
    justifyContent: "space-between",
  },
});
