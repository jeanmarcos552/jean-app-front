import React from "react";

import { Colors } from "@/constants/theme";
import { ColorsType, theme } from "@/theme";
import { ActivityIndicator, StyleSheet, ViewProps } from "react-native";
import Text from "../Text";
import View from "../View";

type LoadingProps = {
  children?: string;
  color?: keyof typeof theme.colors;
  style?: ViewProps["style"];
  backgroundColor?: ColorsType;
};
export const Loading = ({
  children,
  color = "secundary",
  style,
  backgroundColor = "black",
}: LoadingProps) => {
  return (
    <View style={StyleSheet.flatten([{ backgroundColor: "#16161628" }, style])}>
      <View
        style={StyleSheet.flatten([
          styles.loading,
          {
            backgroundColor: Colors[backgroundColor],
          },
        ])}
      >
        <ActivityIndicator size={22} color={theme.colors[color]} />
        {children && (
          <Text color={color} type="small">
            {children}
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  loading: {
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
  },
});
