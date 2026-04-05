import { BackgroundType, theme } from "@/theme";
import React from "react";
import {
  FlexStyle,
  PressableProps,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import Text from "../Text";

export type CardProps = PressableProps & {
  children: React.ReactNode;
  variant?: BackgroundType;
  style?: StyleProp<ViewStyle>;
  size?: "small" | "medium" | "large";
  alignContent?: FlexStyle["alignItems"];
  title?: string;
};
export const Root = ({
  children,
  style,
  title,
  alignContent,
  ...rest
}: CardProps) => {
  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { ...rest });
    }
    return child;
  });

  return (
    <View style={[styles.full]}>
      {title && <Text type="subtitulo">{title}</Text>}
      <View
        style={[
          styles.container,
          {
            backgroundColor: theme.background[rest.variant || "primary"],
            borderColor: theme.border[rest.variant || "primary"],
            shadowColor: theme.shadows[rest.variant || "primary"],
            alignItems: alignContent,
          },
          style,
        ]}
      >
        {childrenWithProps}
      </View>
    </View>
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
});
