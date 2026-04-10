import React from "react";
import { StyleSheet } from "react-native";
import { Link } from "expo-router";
import { Layout } from "@components/ui/Layout";
import { Button } from "@components/ui/Buttons";
import Text from "@components/ui/Text";
import { InputText } from "@components/ui/Inputs";
import View from "@components/ui/View";
import { usePageSignIn } from "@/models/use-page-signin";

export default function EmailSenhaScreen() {
  const { form, handleLogin, isLoading } = usePageSignIn();

  const sections = [
    {
      data: [
        <View key="form">
          <InputText
            name="login"
            control={form.control}
            label="E-mail ou CPF"
            placeholder="Digite seu e-mail ou CPF"
            mask="emailOrCpf"
            keyboardType="email-address"
          />
          <InputText
            name="senha"
            control={form.control}
            label="Senha"
            placeholder="Digite sua senha"
            secureTextEntry
          />
        </View>,
      ],
    },
  ];

  return (
    <Layout.Root>
      <Layout.Header title="Entrar" />

      <Layout.Formulario
        sections={sections}
        keyExtractor={(item: any) => item.key}
        renderItem={({ item }: any) => <View style={styles.field}>{item}</View>}
        renderSectionHeader={() => null}
      />

      <Layout.Footer>
        <Layout.Button
          variant="default"
          size="large"
          onPress={handleLogin}
          isLoading={isLoading}
        >
          Entrar
        </Layout.Button>
      </Layout.Footer>
    </Layout.Root>
  );
}

const styles = StyleSheet.create({
  field: {
    marginBottom: 4,
  },
});
