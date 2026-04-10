import React from "react";
import { StyleSheet } from "react-native";
import { Layout } from "@components/ui/Layout";
import { Button } from "@components/ui/Buttons";

import { usePageCriarMeta } from "@/models/use-page-criar-meta";
import { Input } from "@/components/ui/Inputs";
import View from "@/components/ui/View";

const valueTypeOptions = [
  { label: "Financeira (PIX)", value: "money" },
  { label: "Progresso (%)", value: "percentage" },
];

const frequencyOptions = [
  { label: "Diaria", value: "daily" },
  { label: "Semanal", value: "weekly" },
  { label: "Mensal", value: "monthly" },
  { label: "Anual", value: "yearly" },
];

export default function CriarMetaScreen() {
  const { form, handleSubmit, isLoading } = usePageCriarMeta();

  const sections = [
    {
      key: "form",
      data: [
        <Input.Text
          key="name"
          name="name"
          control={form.control}
          label="Nome da meta"
          placeholder="Ex: Viagem Europa"
        />,
        <Input.TextArea
          key="description"
          name="description"
          control={form.control}
          label="Descricao (opcional)"
          placeholder="Descreva sua meta..."
        />,
        <Input.Radio
          key="value_type"
          name="value_type"
          control={form.control}
          label="Tipo da meta"
          options={valueTypeOptions}
        />,
        <Input.Text
          key="total_value"
          name="total_value"
          control={form.control}
          label="Valor total"
          placeholder="R$ 0,00"
          mask="currency"
          keyboardType="numeric"
        />,
        <Input.Date
          name="end_date"
          key="end_date"
          control={form.control}
          label="Data final"
          minimumDate={new Date()}
        />,
        <Input.Select
          key="reminder_frequency"
          name="reminder_frequency"
          control={form.control}
          label="Frequencia de lembrete"
          options={frequencyOptions}
        />,
        <Input.Text
          key="categories"
          name="categories"
          control={form.control}
          label="Categorias (separadas por virgula)"
          placeholder="viagem, lazer"
        />,
      ],
    },
  ];

  return (
    <Layout.Root>
      <Layout.Header title="Nova Meta" />

      <Layout.Formulario
        sections={sections}
        keyExtractor={(item: { key: string }) => item.key}
        renderItem={({ item }: any) => <View style={styles.field}>{item}</View>}
        renderSectionHeader={() => null}
      />

      <Layout.Footer>
        <Layout.Button
          variant="default"
          size="large"
          onPress={handleSubmit}
          isLoading={isLoading}
        >
          Criar Meta
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
