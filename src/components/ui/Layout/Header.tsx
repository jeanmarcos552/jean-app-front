import { theme } from "@/theme";
import { HeaderBackButton } from "@react-navigation/elements";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Platform, StyleSheet, View } from "react-native";
import Flex from "../Flex";
import Text from "../Text";
import { Card } from "../Card";

type HeaderProps = {
  children?: React.ReactNode;
  title?: string;
  subtitle?: string | React.ReactNode;
  callback?: () => void;
};
export function Header({ title, subtitle, children, callback }: HeaderProps) {
  const navigation = useNavigation();

  return (
    <View style={styles.titulo}>
      <View style={styles.header}>
        <Card.Icon>
          <HeaderBackButton
            onPress={() => {
              if (callback) {
                callback();
              } else {
                navigation.goBack();
              }
            }}
            tintColor={theme.colors.white}
          />
        </Card.Icon>
        <Flex flex={1}>
          {title && <Text type="titulo">{title}</Text>}
          {subtitle &&
            (typeof subtitle === "string" ? (
              <Text type="small" color="gray">
                {subtitle}
              </Text>
            ) : (
              subtitle
            ))}
        </Flex>
      </View>
      {children && children}
    </View>
  );
}

const styles = StyleSheet.create({
  titulo: {
    marginTop: Platform.OS === "ios" ? 0 : 18,
    marginBottom: 18,
    gap: 18,
  },
  botoes: {
    justifyContent: "center",
    gap: 18,
    flexDirection: "row",
  },
  header: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    gap: 4,
  },
});
