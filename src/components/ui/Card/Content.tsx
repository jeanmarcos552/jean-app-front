import { BackgroundType } from "@/theme";
import React from "react";
import {
   FlexStyle,
   PressableProps,
   StyleProp,
   StyleSheet,
   View,
   ViewStyle,
} from "react-native";

export type CardProps = PressableProps & {
  children: React.ReactNode;
  variant?: BackgroundType;
  style?: StyleProp<ViewStyle>;
  alignContent?: FlexStyle["alignContent"];
  justifyContent?: FlexStyle["justifyContent"];
  direction?: FlexStyle["flexDirection"];
};
export const Content = ({
  children,
  style,
  alignContent,
  justifyContent,
  direction,
  ...rest
}: CardProps) => {
  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { ...rest });
    }
    return child;
  });

  return (
    <View
      style={[
        styles.full,
        [
          {
            alignContent,
            justifyContent,
            flexDirection: direction,
          },
          style,
        ],
      ]}
      {...rest}
    >
      {childrenWithProps}
    </View>
  );
};
const styles = StyleSheet.create({
  full: {
    position: "relative",
    gap: 8,
    width: "100%",
  },
  container: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    justifyContent: "space-between",
    borderRadius: 16,
    gap: 22,
  },
});
