import React, { ReactNode } from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type RootProps = {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export const FooterLayout = ({ children, style }: RootProps) => {
  const { bottom, left, right } = useSafeAreaInsets();

  return (
    <View
      style={StyleSheet.flatten([
        style,
        styles.containerFooter,
        { bottom, left, right },
      ])}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  containerFooter: {
    position: "absolute",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    left: 0,
    right: 0,
    gap: 12,
  },
});
