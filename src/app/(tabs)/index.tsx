import React, { useCallback } from "react";
import { StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Layout } from "@components/ui/Layout";
import { Card } from "@components/ui/Card";
import { Button } from "@components/ui/Buttons";
import { useAuth } from "@/contexts/authContexts";
import { useGoals } from "@/queries/useGoals";
import { Goal } from "@/types/goal";
import { money } from "@/helper/Mask";
import { formatDate } from "@/helper/date-format";
import View from "@/components/ui/View";
import Text from "@/components/ui/Text";

export default function HomeScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const { data: goals, isLoading, refetch } = useGoals();

  const sections = [
    {
      key: "content",
      data: [
        { key: "header" },
        ...(goals && goals.length > 0
          ? goals.map((goal) => ({ key: `goal-${goal.id}`, goal }))
          : [{ key: "empty" }]),
      ],
    },
  ];

  const renderItem = useCallback(
    ({ item }: { item: any }) => {
      if (item.key === "header") {
        return (
          <Card.Root variant="black">
            <Card.Header>
              <Card.Title after="Suas metas colaborativas">
                Ola, {user?.name?.split(" ")[0]}
              </Card.Title>
              <View>
                <Button
                  size="small"
                  onPress={() => router.push("/goals/criar")}
                >
                  + Nova Meta
                </Button>
              </View>
            </Card.Header>
          </Card.Root>
        );
      }

      if (item.key === "empty") {
        return (
          <Card.Root>
            <Card.Content>
              <Text type="subtitulo" color="gray">
                Voce ainda nao participa de nenhuma meta.
              </Text>
              <Button
                variant="outline"
                size="medium"
                onPress={() => router.push("/goals/criar")}
                style={{ marginTop: 12 }}
              >
                Criar minha primeira meta
              </Button>
            </Card.Content>
          </Card.Root>
        );
      }

      const goal: Goal = item.goal;
      return (
        <Card.Press onPress={() => router.push(`/goals/${goal.id}`)}>
          <Card.Header>
            <View style={{ flex: 1, gap: 4 }}>
              <Card.Title>{goal.name}</Card.Title>
              <Card.Label>
                {goal.value_type === "money"
                  ? money(parseFloat(goal.total_value), true)
                  : `${goal.total_value}%`}{" "}
                - Ate {formatDate(goal.end_date)}
              </Card.Label>
            </View>
            <Card.Badge variant={goal.status === "active" ? "success" : "gray"}>
              {goal.status === "active"
                ? "Ativa"
                : goal.status === "completed"
                  ? "Concluida"
                  : "Cancelada"}
            </Card.Badge>
          </Card.Header>
        </Card.Press>
      );
    },
    [goals, user],
  );

  if (isLoading) {
    return (
      <Layout.Root>
        <Layout.Loading />
      </Layout.Root>
    );
  }

  return (
    <Layout.Root>
      <Layout.SectionList
        sections={sections}
        renderItem={renderItem}
        renderSectionHeader={() => null}
        refreshing={isLoading}
        onRefresh={refetch}
      />
    </Layout.Root>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  headerText: {
    flex: 1,
    gap: 4,
  },
});
