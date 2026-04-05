import { ColorsType } from "@/theme";
import React from "react";
import { StyleSheet, View } from "react-native";
import { TextPropss } from "../Text";

type TitleProps = {
  children: React.ReactNode;
  style?: TextPropss["style"];
  variant?: ColorsType;
};
export const CardHeader = ({ children, style, ...rest }: TitleProps) => {
  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { ...rest });
    }
    return child;
  });

  return <View style={styles.container}>{childrenWithProps}</View>;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    justifyContent: "flex-start",
    flexShrink: 1,
    maxWidth: "100%",
  },
});
