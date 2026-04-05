import React from "react";
import { Platform, StyleSheet } from "react-native";
import { Link } from "expo-router";
import { Layout } from "@components/ui/Layout";
import { Button } from "@components/ui/Buttons";
import { Text } from "@components/ui/Text";
import { Flex } from "@components/ui/Flex";
import { View } from "@components/ui/View";
import { usePageSignIn } from "@/models/use-page-signin";

export default function SignInScreen() {
  const { handleGoogleLogin, isLoading } = usePageSignIn();

  return (
    <Layout.Root>
      <Flex variant="center" flex={2}>
        <Text type="titulo" style={styles.logo}>
          Metas
        </Text>
        <Text type="subtitulo">Colaborativas</Text>
      </Flex>

      <View style={styles.buttons}>
        <Button
          variant="default"
          size="large"
          onPress={handleGoogleLogin}
          isLoading={isLoading}
          style={styles.button}
        >
          Entrar com Google
        </Button>

        <Link href="/(auth)/email-senha" asChild>
          <Button variant="outline" size="large" style={styles.button}>
            Entrar com e-mail e senha
          </Button>
        </Link>

        {Platform.OS === "ios" && (
          <Button variant="dark" size="large" style={styles.button}>
            Entrar com Apple
          </Button>
        )}

        <Link href="/(auth)/cadastro" asChild>
          <Button variant="link" size="link">
            Criar conta
          </Button>
        </Link>
      </View>
    </Layout.Root>
  );
}

const styles = StyleSheet.create({
  logo: {
    fontSize: 32,
  },
  buttons: {
    flex: 1,
    justifyContent: "flex-end",
    paddingHorizontal: 24,
    paddingBottom: 40,
    gap: 12,
    alignItems: "center",
  },
  button: {
    width: "100%",
  },
});
