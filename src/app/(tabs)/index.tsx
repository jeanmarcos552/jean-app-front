import React, { useCallback } from "react";
import { StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Layout } from "@components/ui/Layout";
import { Card } from "@components/ui/Card";
import { Text } from "@components/ui/Text";
import { View } from "@components/ui/View";
import { Button } from "@components/ui/Buttons";
import { useAuth } from "@/contexts/authContexts";
import { useGoals } from "@/queries/useGoals";
import { Goal } from "@/types/goal";
import { money } from "@/helper/Mask";
import { formatDate } from "@/helper/date-format";

type SectionItem =
  | { key: "header" }
  | { key: "goals"; data: Goal[] }
  | { key: "empty" };

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
          <View variant="row" style={styles.headerRow}>
            <View style={styles.headerText}>
              <Text type="titulo">
                Ola, {user?.name?.split(" ")[0]}
              </Text>
              <Text type="subtitulo">Suas metas colaborativas</Text>
            </View>
            <Button
              variant="default"
              size="small"
              onPress={() => router.push("/goals/criar")}
            >
              + Nova Meta
            </Button>
          </View>
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
            <Card.Badge color={goal.status === "active" ? "success" : "gray"}>
              {goal.status === "active" ? "Ativa" : goal.status === "completed" ? "Concluida" : "Cancelada"}
            </Card.Badge>
          </Card.Header>
        </Card.Press>
      );
    },
    [goals, user]
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
        keyExtractor={(item: any) => item.key}
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
