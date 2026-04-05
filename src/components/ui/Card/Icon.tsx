import { BackgroundType, theme } from "@/theme";
import React from "react";
import { StyleProp, StyleSheet, View } from "react-native";
import { CardProps } from "./Root";

export const Icon = ({
  children,
  variant = "primary",
  size,
  style,
}: CardProps) => {
  // const bg = StyleSheet.create({
  //   backgroundColor: {
  //     backgroundColor: theme.background[variant ?? "info"],
  //   },
  //   backgroundIcon: themeIconStyles[variant ?? "info"],
  // });

  return (
    // <View
    //   style={[
    //     styles.containerBorder,
    //     bg.backgroundColor,
    //     sizeStyle[size ?? "medium"],
    //   ]}
    // >
    <View
      style={[
        styles.container,
        themeIconStyles[variant],
        styles.containerBorder,
        sizeStyleIcon[size ?? "medium"],
        style,
      ]}
    >
      {children}
    </View>
    // </View>
  );
};

const styles = StyleSheet.create({
  containerBorder: {
    alignItems: "center",
    justifyContent: "center",
    // borderWidth: 1,
  },
  container: {
    alignItems: "center",
    justifyContent: "center",
    padding: 6,
  },
});

const sizeStyleIcon = StyleSheet.create({
  small: {
    height: 28,
    width: 28,
    padding: 0,
    borderRadius: 56,
  },
  medium: {
    height: 40,
    width: 40,
    borderRadius: 80,
  },
  large: {
    height: 60,
    width: 60,
    borderRadius: 120,
  },
});

const themeIconStyles: Record<
  BackgroundType,
  StyleProp<any>
> = StyleSheet.create({
  primary: {
    backgroundColor: "#bf1e873a",
    borderColor: "#bf1e8765",
  },
  secundary: {
    backgroundColor: "#bf1e8725",
    borderColor: "#ff62c825",
  },
  warning: {
    backgroundColor: "#fbe4b444",
    borderColor: "#f7c84850",
  },
  info: {
    backgroundColor: "#dbeafe2d",
    borderColor: theme.border.info,
  },
  success: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderColor: theme.border.success,
  },
  danger: {
    backgroundColor: "rgba(247, 207, 207, 0.15)",
    borderColor: theme.border.danger,
  },
  gray: {
    backgroundColor: "#e9e9e94d",
    borderColor: theme.border.gray,
  },
  light: {
    backgroundColor: "#ffffff",
    borderColor: "#f3f3f3ff",
  },

  black: {
    backgroundColor: "#000000",
    borderColor: "#000000",
  },

  white: {
    backgroundColor: "#ffffff",
    borderColor: "#f3f3f3ff",
  },
});

// const sizeStyle = StyleSheet.create({
//   small: {
//     height: 30,
//     width: 30,
//     borderRadius: 60,
//   },
//   medium: {
//     height: 50,
//     width: 50,
//     borderRadius: 100,
//   },
//   large: {
//     height: 70,
//     width: 70,
//     borderRadius: 140,
//   },
// });
