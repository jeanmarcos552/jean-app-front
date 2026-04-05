import React, { useEffect } from "react";
import { Alert, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Layout } from "@components/ui/Layout";
import { Button } from "@components/ui/Buttons";
import { InputText, InputDate, InputSelect, InputTextArea } from "@components/ui/Inputs";
import { View } from "@components/ui/View";
import { useGoalById, useUpdateGoal } from "@/queries/useGoals";
import { getApiErrorMessage } from "@/lib/api";

const frequencyOptions = [
  { label: "Diaria", value: "daily" },
  { label: "Semanal", value: "weekly" },
  { label: "Mensal", value: "monthly" },
  { label: "Anual", value: "yearly" },
];

const schema = z.object({
  name: z.string().min(1, "Nome obrigatorio"),
  description: z.string().optional(),
  end_date: z.string().min(1, "Data obrigatoria"),
  total_value: z.string().min(1, "Valor obrigatorio"),
  reminder_frequency: z.enum(["daily", "weekly", "monthly", "yearly"]),
  categories: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function EditarMetaScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: goal, isLoading: loadingGoal } = useGoalById(id);
  const updateGoal = useUpdateGoal();

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      description: "",
      end_date: "",
      total_value: "",
      reminder_frequency: "monthly",
      categories: "",
    },
  });

  useEffect(() => {
    if (goal) {
      form.reset({
        name: goal.name,
        description: goal.description || "",
        end_date: goal.end_date,
        total_value: goal.total_value,
        reminder_frequency: goal.reminder_frequency,
        categories: goal.categories?.join(", ") || "",
      });
    }
  }, [goal]);

  const handleSubmit = form.handleSubmit(async (data) => {
    try {
      const totalValue = parseFloat(data.total_value.replace(/[^\d.]/g, ""));

      await updateGoal.mutateAsync({
        id,
        payload: {
          name: data.name,
          description: data.description || undefined,
          end_date: data.end_date,
          total_value: totalValue,
          reminder_frequency: data.reminder_frequency,
          categories: data.categories
            ? data.categories.split(",").map((c) => c.trim())
            : [],
        },
      });

      Alert.alert("Sucesso", "Meta atualizada com sucesso!");
      router.back();
    } catch (error: any) {
      Alert.alert("Erro", getApiErrorMessage(error));
    }
  });

  if (loadingGoal) {
    return (
      <Layout.Root>
        <Layout.Header title="Editar Meta" />
        <Layout.Loading />
      </Layout.Root>
    );
  }

  const sections = [
    {
      key: "form",
      data: [
        {
          key: "name",
          component: (
            <InputText name="name" control={form.control} label="Nome da meta" />
          ),
        },
        {
          key: "description",
          component: (
            <InputTextArea name="description" control={form.control} label="Descricao (opcional)" />
          ),
        },
        {
          key: "total_value",
          component: (
            <InputText
              name="total_value"
              control={form.control}
              label="Valor total"
              keyboardType="numeric"
            />
          ),
        },
        {
          key: "end_date",
          component: (
            <InputDate name="end_date" control={form.control} label="Data final" minimumDate={new Date()} />
          ),
        },
        {
          key: "reminder_frequency",
          component: (
            <InputSelect
              name="reminder_frequency"
              control={form.control}
              label="Frequencia"
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
            />
          ),
        },
      ],
    },
  ];

  return (
    <Layout.Root>
      <Layout.Header title="Editar Meta" />

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
          isLoading={updateGoal.isPending}
        >
          Salvar Alteracoes
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
