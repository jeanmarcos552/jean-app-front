import { theme } from "@/theme";
import React from "react";
import { StyleProp, StyleSheet, ViewStyle } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import Text from "../Text";
import View from "../View";

export type BadgeVariant = keyof typeof theme.colors;
type ComponentsProps = {
  children: string | React.ReactNode;
  variant?: BadgeVariant;
  size?: keyof typeof variantSizeStyles;
  style?: StyleProp<ViewStyle>;
  backgroundColor?: string;
  title?: string;
  after?: string;
  before?: string;
};
export function Badge({
  children,
  variant = "info",
  size = "small",
  style,
  title,
  backgroundColor,
  before,
  after,
}: ComponentsProps) {
  return (
    <View style={styles.badge}>
      {title && (
        <Text type="small" color="gray">
          {title}
        </Text>
      )}

      {before && (
        <Text type="small" color="gray">
          {before}
        </Text>
      )}

      <View style={[styles.principal, { position: "relative" }]}>
        <View
          style={[
            variantSizeStyles[size],
            {
              borderRadius: 999,
              backgroundColor:
                backgroundColor || theme.colors[variant || "info"],
              shadowColor: backgroundColor || theme.colors[variant || "info"],
              shadowOffset: { width: 6, height: 6 },
              shadowOpacity: 1,
              shadowRadius: 8,
              elevation: 10,
              position: "absolute",
            },
          ]}
        />
        <View
          style={[
            styles.container,
            style,
            {
              backgroundColor:
                backgroundColor || theme.colors[variant || "info"],
            },
            variantSizeStyles[size],
            { zIndex: 1 },
          ]}
        />
        <View variant="row" style={styles.afterChild}>
          <Animated.View
            entering={FadeIn}
            exiting={FadeOut}
            // style={{ flex: 1 }}
          >
            <Text
              type="small"
              numberOfLines={3}
              style={{ flexShrink: 1, flexWrap: "wrap" }}
              color={variant}
            >
              {children}
            </Text>
          </Animated.View>
          {after && <Text type="small">{after}</Text>}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { gap: 0 },
  principal: {
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
  },
  container: {
    borderRadius: 48,
    justifyContent: "center",
    alignItems: "center",
  },
  afterChild: {
    gap: 2,
    alignItems: "flex-end",
  },
});

const variantSizeStyles = StyleSheet.create({
  small: {
    width: 8,
    height: 8,
  },
  medium: {
    width: 14,
    height: 14,
  },
  large: {
    width: 18,
    height: 18,
  },
});
