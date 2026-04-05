import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchGoals,
  fetchGoalById,
  createGoal,
  updateGoal,
  deleteGoal,
  fetchContributions,
  fetchMyContributions,
  fetchPixPayload,
  addParticipant,
  removeParticipant,
  inviteByEmail,
} from "@/services/goals.service";
import { CreateGoalPayload, UpdateGoalPayload } from "@/types/goal";

// Goals
export function useGoals() {
  return useQuery({
    queryKey: ["goals"],
    queryFn: fetchGoals,
  });
}

export function useGoalById(id: string) {
  return useQuery({
    queryKey: ["goal", id],
    queryFn: () => fetchGoalById(id),
    enabled: !!id,
  });
}

export function useCreateGoal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateGoalPayload) => createGoal(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goals"] });
    },
  });
}

export function useUpdateGoal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateGoalPayload }) =>
      updateGoal(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["goals"] });
      queryClient.invalidateQueries({ queryKey: ["goal", variables.id] });
    },
  });
}

export function useDeleteGoal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteGoal(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goals"] });
    },
  });
}

// Participants
export function useAddParticipant() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ goalId, userId }: { goalId: string; userId: string }) =>
      addParticipant(goalId, userId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["goal", variables.goalId] });
    },
  });
}

export function useRemoveParticipant() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ goalId, userId }: { goalId: string; userId: string }) =>
      removeParticipant(goalId, userId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["goal", variables.goalId] });
      queryClient.invalidateQueries({ queryKey: ["contributions", variables.goalId] });
    },
  });
}

export function useInviteByEmail() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ goalId, email }: { goalId: string; email: string }) =>
      inviteByEmail(goalId, email),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["goal", variables.goalId] });
    },
  });
}

// Contributions
export function useContributions(goalId: string) {
  return useQuery({
    queryKey: ["contributions", goalId],
    queryFn: () => fetchContributions(goalId),
    enabled: !!goalId,
  });
}

export function useMyContributions(goalId: string) {
  return useQuery({
    queryKey: ["my-contributions", goalId],
    queryFn: () => fetchMyContributions(goalId),
    enabled: !!goalId,
  });
}

// PIX
export function usePixPayload(goalId: string, contributionId: string) {
  return useQuery({
    queryKey: ["pix", goalId, contributionId],
    queryFn: () => fetchPixPayload(goalId, contributionId),
    enabled: !!goalId && !!contributionId,
  });
}
