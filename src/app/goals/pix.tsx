import React from "react";
import { Alert, StyleSheet, Image } from "react-native";
import * as Clipboard from "expo-clipboard";
import { useLocalSearchParams } from "expo-router";
import { Layout } from "@components/ui/Layout";
import { Card } from "@components/ui/Card";
import Text from "@components/ui/Text";
import View from "@components/ui/View";
import { Button } from "@components/ui/Buttons";
import { usePixPayload } from "@/queries/useGoals";
import { money } from "@/helper/Mask";
import { formatDate } from "@/helper/date-format";

export default function PixScreen() {
  const { goalId, contributionId } = useLocalSearchParams<{
    goalId: string;
    contributionId: string;
  }>();

  const { data: pix, isLoading } = usePixPayload(goalId, contributionId);

  const handleCopy = async () => {
    if (pix?.pix_copy_paste) {
      await Clipboard.setStringAsync(pix.pix_copy_paste);
      Alert.alert("Copiado!", "Codigo PIX copiado para a area de transferencia.");
    }
  };

  if (isLoading || !pix) {
    return (
      <Layout.Root>
        <Layout.Header title="Pagamento PIX" />
        <Layout.Loading />
      </Layout.Root>
    );
  }

  return (
    <Layout.Root>
      <Layout.Header title="Pagamento PIX" />

      <Layout.Scroll>
        <Card.Root>
          <Card.Content>
            <View variant="center" style={styles.qrContainer}>
              {pix.qr_code_base64 && (
                <Image
                  source={{
                    uri: `data:image/png;base64,${pix.qr_code_base64}`,
                  }}
                  style={styles.qrCode}
                  resizeMode="contain"
                />
              )}
            </View>

            <View variant="center" style={styles.info}>
              <Text type="titulo">
                {money(parseFloat(pix.amount), true)}
              </Text>
              <Text type="subtitulo">
                Vencimento: {formatDate(pix.due_date)}
              </Text>
            </View>

            <Button variant="default" size="large" onPress={handleCopy}>
              Copiar codigo PIX
            </Button>
          </Card.Content>
        </Card.Root>
      </Layout.Scroll>
    </Layout.Root>
  );
}

const styles = StyleSheet.create({
  qrContainer: {
    padding: 16,
  },
  qrCode: {
    width: 220,
    height: 220,
  },
  info: {
    paddingVertical: 16,
    gap: 4,
  },
});
