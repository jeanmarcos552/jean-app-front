import { ColorsType } from "@/theme";
import React from "react";
import { StyleProp, StyleSheet, ViewStyle } from "react-native";
import { Card } from "../Card";
import Flex from "../Flex";
import Text from "../Text";
import View from "../View";

type HeaderProps = {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  icon?: React.ReactNode;
  subtitle?: string;
  variant?: ColorsType;
};
export function Title({
  children,
  icon,
  style,
  subtitle,
  variant,
}: HeaderProps) {
  return (
    <View style={[styles.titulo, style]}>
      {icon && <Card.Icon variant={variant || "primary"}>{icon}</Card.Icon>}
      <Flex flex={1}>
        {children && (
          <Text type="titulo" style={styles.fontTitulo}>
            {children}
          </Text>
        )}
        {subtitle && (
          <Text type="paragrafo" color="gray">
            {subtitle}
          </Text>
        )}
      </Flex>
    </View>
  );
}

const styles = StyleSheet.create({
  titulo: {
    marginVertical: 22,
    flexDirection: "row",
    alignItems: "center",
    gap: 18,
  },
  row: {
    alignItems: "center",
    gap: 8,
  },
  fontTitulo: {
    fontSize: 18,
  },
});
