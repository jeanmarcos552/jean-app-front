import React, { useState } from "react";
import { Alert, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Layout } from "@components/ui/Layout";
import { Button } from "@components/ui/Buttons";
import { InputText } from "@components/ui/Inputs";
import View from "@components/ui/View";
import { useInviteByEmail } from "@/queries/useGoals";
import { getApiErrorMessage } from "@/lib/api";

const schema = z.object({
  email: z.string().min(1, "Email obrigatorio").email("Email invalido"),
});

export default function ConvidarScreen() {
  const { goalId } = useLocalSearchParams<{ goalId: string }>();
  const router = useRouter();
  const inviteByEmail = useInviteByEmail();

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  });

  const handleInvite = form.handleSubmit(async (data) => {
    try {
      await inviteByEmail.mutateAsync({ goalId, email: data.email });
      Alert.alert("Sucesso", "Convite enviado com sucesso!");
      router.back();
    } catch (error: any) {
      Alert.alert("Erro", getApiErrorMessage(error));
    }
  });

  const sections = [
    {
      key: "form",
      data: [
        {
          key: "email",
          component: (
            <InputText
              name="email"
              control={form.control}
              label="E-mail do convidado"
              placeholder="email@exemplo.com"
              keyboardType="email-address"
            />
          ),
        },
      ],
    },
  ];

  return (
    <Layout.Root>
      <Layout.Header title="Convidar Participante" />

      <Layout.Formulario
        sections={sections}
        keyExtractor={(item: any) => item.key}
        renderItem={({ item }: any) => (
          <View style={styles.field}>{item.component}</View>
        )}
        renderSectionHeader={() => null}
      />

      <Layout.Footer>
        <Button
          variant="default"
          size="large"
          onPress={handleInvite}
          isLoading={inviteByEmail.isPending}
        >
          Enviar Convite
        </Button>
      </Layout.Footer>
    </Layout.Root>
  );
}

const styles = StyleSheet.create({
  field: {
    marginBottom: 4,
  },
});
