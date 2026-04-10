import React from "react";
import { Alert, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Layout } from "@components/ui/Layout";
import { Button } from "@components/ui/Buttons";
import { InputText } from "@components/ui/Inputs";
import View from "@components/ui/View";
import { signUp } from "@/services/auth.service";
import { useAuth } from "@/contexts/authContexts";
import { useAuthStore } from "@/stores/auth";
import { getApiErrorMessage } from "@/lib/api";
import { User } from "@/types/user";

const schema = z.object({
  name: z.string().min(1, "Nome obrigatorio"),
  email: z.string().min(1, "Email obrigatorio").email("Email invalido"),
  cpf: z.string().min(14, "CPF invalido"),
  password: z.string().min(8, "Minimo 8 caracteres"),
  pix_key: z.string().min(1, "Chave PIX obrigatoria"),
});

type FormData = z.infer<typeof schema>;

export default function CadastroScreen() {
  const { login } = useAuth();
  const { setLoading, isLoading } = useAuthStore();
  const router = useRouter();

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", cpf: "", password: "", pix_key: "" },
  });

  const handleCadastro = form.handleSubmit(async (data) => {
    try {
      setLoading(true);
      const response = await signUp(data);
      const { user, token } = response.data;
      login(user as User, token, []);
    } catch (error: any) {
      Alert.alert("Erro", getApiErrorMessage(error));
    } finally {
      setLoading(false);
    }
  });

  const sections = [
    {
      key: "form",
      data: [
        {
          key: "name",
          component: (
            <InputText name="name" control={form.control} label="Nome" placeholder="Seu nome completo" />
          ),
        },
        {
          key: "email",
          component: (
            <InputText
              name="email"
              control={form.control}
              label="E-mail"
              placeholder="seu@email.com"
              keyboardType="email-address"
            />
          ),
        },
        {
          key: "cpf",
          component: (
            <InputText name="cpf" control={form.control} label="CPF" placeholder="000.000.000-00" mask="cpf" />
          ),
        },
        {
          key: "password",
          component: (
            <InputText
              name="password"
              control={form.control}
              label="Senha"
              placeholder="Minimo 8 caracteres"
              secureTextEntry
            />
          ),
        },
        {
          key: "pix_key",
          component: (
            <InputText
              name="pix_key"
              control={form.control}
              label="Chave PIX"
              placeholder="Sua chave PIX"
            />
          ),
        },
      ],
    },
  ];

  return (
    <Layout.Root>
      <Layout.Header title="Criar conta" />

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
          onPress={handleCadastro}
          isLoading={isLoading}
        >
          Criar conta
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
