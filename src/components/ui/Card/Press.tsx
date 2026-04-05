import { BackgroundType, theme } from "@/theme";
import React from "react";
import {
   Pressable,
   PressableProps,
   StyleProp,
   StyleSheet,
   View,
   ViewStyle,
} from "react-native";

export type CardVariant = keyof BackgroundType;
export type CardProps = PressableProps & {
  children?: React.ReactNode;
  variant?: keyof typeof theme.background;
  type?: "widget" | "list";
  style?: StyleProp<ViewStyle>;
  size?: "small" | "medium" | "large";
  disabledLoading?: boolean;
  alignContent?: "left" | "center" | "right";
};
export const Press = ({
  children,
  style,
  disabledLoading,
  size,
  type = "widget",
  ...rest
}: CardProps) => {
  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { ...rest });
    }
    return child;
  });

  return (
    <Pressable
      style={[styles.full, { opacity: !!rest.disabled ? 0.6 : 1 }]}
      {...rest}
    >
      <View
        style={[
          type === "widget" ? styles.container : styles.list,
          size === "small"
            ? styles.small
            : size === "medium"
              ? styles.medium
              : styles.large,
          {
            backgroundColor: theme.background[rest.variant || "primary"],
            borderColor: theme.border[rest.variant || "primary"],
            shadowColor: theme.shadows[rest.variant || "primary"],
            alignItems:
              rest.alignContent === "right"
                ? "flex-end"
                : rest.alignContent === "center"
                  ? "center"
                  : "flex-start",
          },
          style,
        ]}
      >
        {childrenWithProps}
      </View>
    </Pressable>
  );
};
const styles = StyleSheet.create({
  full: {
    flex: 1,
    position: "relative",
    overflow: "hidden",
  },
  container: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    flex: 1,
    justifyContent: "space-between",
    borderRadius: 16,
    gap: 22,

    margin: 2,
    borderWidth: 1.5,
  },
  list: {
    paddingHorizontal: 8,
    flex: 1,
    justifyContent: "space-between",
    borderRadius: 16,
  },
  small: {
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  medium: {
    paddingVertical: 10,
    paddingHorizontal: 6,
  },
  large: {
    paddingVertical: 14,
    paddingHorizontal: 10,
  },
});
