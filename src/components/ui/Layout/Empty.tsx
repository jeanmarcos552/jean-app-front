import React from "react";

import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StyleSheet } from "react-native";
import { Button } from "../Buttons";
import { Icon } from "../Card/Icon";
import Text from "../Text";
import View from "../View";
import { Header } from "./Header";
import { RootLayout } from "./Root";

type EmptyProps = {
  children?: React.ReactNode;
  mensagem?: string;
};
export const Empty = ({ children, mensagem }: EmptyProps) => {
  const msg = mensagem || "Nenhum dado encontrado.";
  const router = useRouter();

  return (
    <RootLayout>
      <Header title="Ops!" subtitle="Parece que não há nada aqui..." />

      <View style={styles.container}>
        <Icon style={styles.icon} size="large">
          <AntDesign name="frown" size={18} color="#ffffff" />
        </Icon>
        <Text type="titulo" style={styles.icon}>
          {msg}
        </Text>

        <View style={styles.loading}>{children ?? children}</View>
      </View>

      <Button variant="outline" onPress={() => router.back()}>
        Voltar
      </Button>
    </RootLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 22,
  },

  loading: {
    gap: 22,
  },

  icon: {
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    gap: 12,
  },
});
