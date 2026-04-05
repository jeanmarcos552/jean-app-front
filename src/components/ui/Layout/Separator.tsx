import { Background } from "@/constants/theme";
import { BackgroundType } from "@/theme";
import React, { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type RootProps = {
  children?: ReactNode;
  size?: number;
  color?: BackgroundType;
};

export const Separator = ({ children, size, color }: RootProps) => {
  const { bottom } = useSafeAreaInsets();

  return (
    <View
      style={StyleSheet.flatten([
        ,
        {
          bottom: bottom,
          height: size || styles.containerSeparator.height,
          backgroundColor: color ? Background[color] : undefined,
        },
      ])}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  containerSeparator: {
    height: 80,
  },
});
