import React from "react";
import { StyleSheet } from "react-native";
import { Layout } from "@components/ui/Layout";
import { Button } from "@components/ui/Buttons";
import { InputText, InputDate, InputSelect, InputRadio, InputTextArea } from "@components/ui/Inputs";
import { View } from "@components/ui/View";
import { usePageCriarMeta } from "@/models/use-page-criar-meta";

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
        {
          key: "name",
          component: (
            <InputText
              name="name"
              control={form.control}
              label="Nome da meta"
              placeholder="Ex: Viagem Europa"
            />
          ),
        },
        {
          key: "description",
          component: (
            <InputTextArea
              name="description"
              control={form.control}
              label="Descricao (opcional)"
              placeholder="Descreva sua meta..."
            />
          ),
        },
        {
          key: "value_type",
          component: (
            <InputRadio
              name="value_type"
              control={form.control}
              label="Tipo da meta"
              options={valueTypeOptions}
            />
          ),
        },
        {
          key: "total_value",
          component: (
            <InputText
              name="total_value"
              control={form.control}
              label="Valor total"
              placeholder="R$ 0,00"
              mask="currency"
              keyboardType="numeric"
            />
          ),
        },
        {
          key: "end_date",
          component: (
            <InputDate
              name="end_date"
              control={form.control}
              label="Data final"
              minimumDate={new Date()}
            />
          ),
        },
        {
          key: "reminder_frequency",
          component: (
            <InputSelect
              name="reminder_frequency"
              control={form.control}
              label="Frequencia de lembrete"
              options={frequencyOptions}
            />
          ),
        },
        {
          key: "categories",
          component: (
            <InputText
              name="categories"
              control={form.control}
              label="Categorias (separadas por virgula)"
              placeholder="viagem, lazer"
            />
          ),
        },
      ],
    },
  ];

  return (
    <Layout.Root>
      <Layout.Header title="Nova Meta" />

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
          onPress={handleSubmit}
          isLoading={isLoading}
        >
          Criar Meta
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
