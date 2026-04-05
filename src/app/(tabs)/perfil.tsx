import React from "react";
import { Alert, StyleSheet } from "react-native";
import { Layout } from "@components/ui/Layout";
import { Card } from "@components/ui/Card";
import { Text } from "@components/ui/Text";
import { View } from "@components/ui/View";
import { Button } from "@components/ui/Buttons";
import { useAuth } from "@/contexts/authContexts";
import { cpfMask } from "@/helper/Mask";

export default function PerfilScreen() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert("Sair", "Tem certeza que deseja sair?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Sair", style: "destructive", onPress: logout },
    ]);
  };

  return (
    <Layout.Root>
      <Layout.Header title="Perfil" showBack={false} />

      <Layout.Scroll>
        <Card.Root>
          <Card.Content>
            <View style={styles.info}>
              <Text type="titulo">{user?.name}</Text>
              <Text type="paragrafo" color="gray">{user?.email}</Text>
              {user?.cpf && (
                <Text type="small" color="gray">
                  CPF: {cpfMask(user.cpf)}
                </Text>
              )}
              {user?.pix_key && (
                <Text type="small" color="gray">
                  PIX: {user.pix_key}
                </Text>
              )}
            </View>
          </Card.Content>
        </Card.Root>

        <Button
          variant="outline"
          size="large"
          onPress={handleLogout}
          color="#da5050"
        >
          Sair da conta
        </Button>
      </Layout.Scroll>
    </Layout.Root>
  );
}

const styles = StyleSheet.create({
  info: {
    gap: 6,
  },
});
