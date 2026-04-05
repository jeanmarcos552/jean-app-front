import { Alert } from "react-native";
import { useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateGoal } from "@/queries/useGoals";
import { getApiErrorMessage } from "@/lib/api";

const schema = z.object({
  name: z.string().min(1, "Nome obrigatorio"),
  description: z.string().optional(),
  end_date: z.string().min(1, "Data obrigatoria"),
  value_type: z.enum(["money", "percentage"], {
    error: "Selecione o tipo",
  }),
  total_value: z.string().min(1, "Valor obrigatorio"),
  reminder_frequency: z.enum(["daily", "weekly", "monthly", "yearly"], {
    error: "Selecione a frequencia",
  }),
  categories: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export function usePageCriarMeta() {
  const router = useRouter();
  const createGoal = useCreateGoal();

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      description: "",
      end_date: "",
      value_type: "money",
      total_value: "",
      reminder_frequency: "monthly",
      categories: "",
    },
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    try {
      const totalValue = parseFloat(data.total_value.replace(/[^\d,]/g, "").replace(",", "."));

      if (isNaN(totalValue) || totalValue <= 0) {
        Alert.alert("Erro", "Valor invalido");
        return;
      }

      await createGoal.mutateAsync({
        name: data.name,
        description: data.description || undefined,
        end_date: data.end_date,
        value_type: data.value_type,
        total_value: totalValue,
        reminder_frequency: data.reminder_frequency,
        categories: data.categories
          ? data.categories.split(",").map((c) => c.trim())
          : [],
      });

      Alert.alert("Sucesso", "Meta criada com sucesso!");
      router.back();
    } catch (error: any) {
      Alert.alert("Erro", getApiErrorMessage(error));
    }
  });

  return {
    form,
    handleSubmit,
    isLoading: createGoal.isPending,
  };
}
