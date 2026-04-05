import React, { useCallback } from "react";
import { Alert, StyleSheet, Clipboard } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Layout } from "@components/ui/Layout";
import { Card } from "@components/ui/Card";
import { Text } from "@components/ui/Text";
import { View } from "@components/ui/View";
import { Button } from "@components/ui/Buttons";
import { useAuth } from "@/contexts/authContexts";
import {
  useGoalById,
  useDeleteGoal,
  useMyContributions,
  useContributions,
  useRemoveParticipant,
} from "@/queries/useGoals";
import { money } from "@/helper/Mask";
import { formatDate } from "@/helper/date-format";
import { Contribution, GoalParticipant } from "@/types/goal";

const statusLabels: Record<string, { label: string; color: "success" | "warning" | "danger" | "gray" }> = {
  pending: { label: "Pendente", color: "warning" },
  paid: { label: "Pago", color: "success" },
  late: { label: "Atrasado", color: "danger" },
  pending_review: { label: "Em revisao", color: "gray" },
};

export default function GoalDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();

  const { data: goal, isLoading } = useGoalById(id);
  const deleteGoal = useDeleteGoal();
  const removeParticipant = useRemoveParticipant();

  const isOwner = goal?.owner_id === user?.id;
  const isMoney = goal?.value_type === "money";

  const { data: myContributions } = useMyContributions(isMoney ? id : "");
  const { data: allContributions } = useContributions(isOwner && isMoney ? id : "");

  const contributions = isOwner ? allContributions : myContributions;

  const handleDelete = () => {
    Alert.alert("Cancelar meta", "Tem certeza?", [
      { text: "Nao", style: "cancel" },
      {
        text: "Sim, cancelar",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteGoal.mutateAsync(id);
            router.back();
          } catch {
            Alert.alert("Erro", "Nao foi possivel cancelar a meta.");
          }
        },
      },
    ]);
  };

  const handleRemoveParticipant = (participant: GoalParticipant) => {
    Alert.alert("Remover participante", `Remover ${participant.user.name}?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Remover",
        style: "destructive",
        onPress: async () => {
          try {
            await removeParticipant.mutateAsync({
              goalId: id,
              userId: participant.user_id,
            });
          } catch {
            Alert.alert("Erro", "Nao foi possivel remover o participante.");
          }
        },
      },
    ]);
  };

  if (isLoading || !goal) {
    return (
      <Layout.Root>
        <Layout.Header title="Meta" />
        <Layout.Loading />
      </Layout.Root>
    );
  }

  const activeParticipants = goal.goal_participants?.filter(
    (p) => p.status === "active"
  );

  const sections = [
    {
      key: "content",
      data: [
        { key: "info" },
        { key: "participants" },
        ...(isMoney && contributions ? [{ key: "contributions" }] : []),
        ...(isOwner ? [{ key: "actions" }] : []),
      ],
    },
  ];

  const renderItem = useCallback(
    ({ item }: { item: any }) => {
      if (item.key === "info") {
        return (
          <Card.Root>
            <Card.Header>
              <View style={{ flex: 1, gap: 6 }}>
                <Card.Title>{goal.name}</Card.Title>
                {goal.description && (
                  <Text type="paragrafo" color="gray">
                    {goal.description}
                  </Text>
                )}
              </View>
              <Card.Badge color={goal.status === "active" ? "success" : "gray"}>
                {goal.status === "active"
                  ? "Ativa"
                  : goal.status === "completed"
                  ? "Concluida"
                  : "Cancelada"}
              </Card.Badge>
            </Card.Header>
            <Card.Content>
              <View variant="row" style={styles.infoRow}>
                <View style={{ flex: 1 }}>
                  <Text type="small" color="gray">
                    Tipo
                  </Text>
                  <Text type="paragrafo">
                    {isMoney ? "Financeira" : "Progresso"}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text type="small" color="gray">
                    Valor
                  </Text>
                  <Text type="paragrafo">
                    {isMoney
                      ? money(parseFloat(goal.total_value), true)
                      : `${goal.total_value}%`}
                  </Text>
                </View>
              </View>
              <View variant="row" style={styles.infoRow}>
                <View style={{ flex: 1 }}>
                  <Text type="small" color="gray">
                    Prazo
                  </Text>
                  <Text type="paragrafo">{formatDate(goal.end_date)}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text type="small" color="gray">
                    Frequencia
                  </Text>
                  <Text type="paragrafo">{goal.reminder_frequency}</Text>
                </View>
              </View>
              {goal.categories && goal.categories.length > 0 && (
                <View variant="row" style={{ flexWrap: "wrap", gap: 6, marginTop: 8 }}>
                  {goal.categories.map((cat) => (
                    <Card.Badge key={cat} color="secundary">
                      {cat}
                    </Card.Badge>
                  ))}
                </View>
              )}
            </Card.Content>
          </Card.Root>
        );
      }

      if (item.key === "participants") {
        return (
          <Card.Root>
            <Card.Header>
              <Card.Title>Participantes ({activeParticipants?.length || 0})</Card.Title>
            </Card.Header>
            <Card.Content>
              {activeParticipants?.map((p) => (
                <View key={p.id} variant="row" style={styles.participantRow}>
                  <View style={{ flex: 1, gap: 2 }}>
                    <Text type="paragrafo">
                      {p.user.name}
                      {p.role === "owner" ? " (criador)" : ""}
                    </Text>
                    <Text type="small" color="gray">
                      {p.user.email}
                    </Text>
                    {p.late_count > 0 && (
                      <Text type="small" color="warning">
                        {p.late_count} atraso(s)
                      </Text>
                    )}
                  </View>
                  {isOwner && p.role !== "owner" && (
                    <Button
                      variant="link"
                      size="link"
                      color="#da5050"
                      onPress={() => handleRemoveParticipant(p)}
                    >
                      Remover
                    </Button>
                  )}
                </View>
              ))}

              {isOwner && (
                <Button
                  variant="outline"
                  size="small"
                  onPress={() => router.push(`/goals/convidar?goalId=${id}`)}
                  style={{ marginTop: 12 }}
                >
                  Convidar participante
                </Button>
              )}
            </Card.Content>
          </Card.Root>
        );
      }

      if (item.key === "contributions") {
        return (
          <Card.Root>
            <Card.Header>
              <Card.Title>Parcelas</Card.Title>
            </Card.Header>
            <Card.Content>
              {contributions?.map((c: Contribution) => {
                const st = statusLabels[c.status];
                return (
                  <View key={c.id} variant="row" style={styles.contributionRow}>
                    <View style={{ flex: 1, gap: 2 }}>
                      <Text type="paragrafo">
                        Parcela {c.installment_no} - {money(parseFloat(c.amount), true)}
                      </Text>
                      <Text type="small" color="gray">
                        Vencimento: {formatDate(c.due_date)}
                      </Text>
                      {c.user && (
                        <Text type="small" color="gray">
                          {c.user.name}
                        </Text>
                      )}
                    </View>
                    <Card.Badge color={st?.color || "gray"}>
                      {st?.label || c.status}
                    </Card.Badge>
                    {c.status === "pending" && c.user_id === user?.id && (
                      <Button
                        variant="default"
                        size="small"
                        onPress={() =>
                          router.push(`/goals/pix?goalId=${id}&contributionId=${c.id}`)
                        }
                      >
                        Pagar
                      </Button>
                    )}
                  </View>
                );
              })}
              {(!contributions || contributions.length === 0) && (
                <Text type="subtitulo" color="gray">
                  Nenhuma parcela encontrada.
                </Text>
              )}
            </Card.Content>
          </Card.Root>
        );
      }

      if (item.key === "actions") {
        return (
          <View style={styles.actions}>
            <Button
              variant="outline"
              size="large"
              onPress={() => router.push(`/goals/editar?id=${id}`)}
            >
              Editar Meta
            </Button>
            <Button
              variant="outline"
              size="large"
              color="#da5050"
              onPress={handleDelete}
              isLoading={deleteGoal.isPending}
            >
              Cancelar Meta
            </Button>
          </View>
        );
      }

      return null;
    },
    [goal, contributions, isOwner, user]
  );

  return (
    <Layout.Root>
      <Layout.Header title={goal.name} />
      <Layout.SectionList
        sections={sections}
        keyExtractor={(item: any) => item.key}
        renderItem={renderItem}
        renderSectionHeader={() => null}
      />
    </Layout.Root>
  );
}

const styles = StyleSheet.create({
  infoRow: {
    marginTop: 8,
  },
  participantRow: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.05)",
    justifyContent: "space-between",
  },
  contributionRow: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.05)",
    justifyContent: "space-between",
    gap: 8,
  },
  actions: {
    gap: 12,
  },
});
