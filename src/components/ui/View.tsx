import { BackgroundType, theme } from "@/theme";
import React from "react";
import {
   StyleProp,
   StyleSheet,
   ViewProps,
   View as ViewRN,
   ViewStyle,
} from "react-native";

export type ViewProp = ViewProps & {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  variant?: keyof typeof viewStylesVariant;
  backgroundColor?: BackgroundType;
};

const View = ({ children, style, variant, ...rest }: ViewProp) => {
  return (
    <ViewRN
      style={[
        styles.default,
        viewStylesVariant[variant || "column"],
        {
          backgroundColor: rest.backgroundColor
            ? theme.background[rest.backgroundColor]
            : undefined,
        },
        style,
      ]}
      {...rest}
    >
      {children && children}
    </ViewRN>
  );
};

const styles = StyleSheet.create({
  default: {
    gap: 4,
  },
});
export const viewStylesVariant = StyleSheet.create({
  row: {
    flexDirection: "row",
  },
  center: {
    alignItems: "center",
  },
  column: {
    flexDirection: "column",
  },
});

export const viewStyles = StyleSheet.create({
  center: {
    alignItems: "center",
    justifyContent: "center",
  },
  rowDirection: {
    flexDirection: "row",
  },
});

export default View;
