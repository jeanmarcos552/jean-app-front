import { z } from "zod";
import { api } from "@/lib/api";
import {
  Goal,
  Contribution,
  PixPayload,
  CreateGoalPayload,
  UpdateGoalPayload,
} from "@/types/goal";

// Schemas
const ParticipantUserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
});

const GoalParticipantSchema = z.object({
  id: z.string(),
  goal_id: z.string(),
  user_id: z.string(),
  role: z.enum(["owner", "member"]),
  status: z.enum(["active", "invited", "declined", "removed"]),
  late_count: z.number(),
  joined_at: z.string().nullable(),
  created_at: z.string(),
  user: ParticipantUserSchema,
});

const GoalSchema = z.object({
  id: z.string(),
  owner_id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  end_date: z.string(),
  value_type: z.enum(["money", "percentage"]),
  total_value: z.string(),
  reminder_frequency: z.enum(["daily", "weekly", "monthly", "yearly"]),
  status: z.enum(["active", "completed", "cancelled"]),
  categories: z.array(z.string()),
  created_at: z.string(),
  updated_at: z.string(),
  owner: ParticipantUserSchema.optional(),
  goal_participants: z.array(GoalParticipantSchema).optional(),
});

const GoalListSchema = z.array(GoalSchema);

const ContributionSchema = z.object({
  id: z.string(),
  goal_id: z.string(),
  user_id: z.string(),
  installment_no: z.number(),
  amount: z.string(),
  txid: z.string(),
  status: z.enum(["pending", "paid", "late", "pending_review"]),
  due_date: z.string(),
  paid_at: z.string().nullable(),
  transaction_id: z.string().nullable(),
  generation: z.number(),
  created_at: z.string(),
  user: ParticipantUserSchema.optional(),
});

const ContributionListSchema = z.array(ContributionSchema);

const PixPayloadSchema = z.object({
  pix_copy_paste: z.string(),
  qr_code_base64: z.string(),
  amount: z.string(),
  due_date: z.string(),
  txid: z.string(),
});

// Parsers
function parseGoals(data: unknown): Goal[] {
  try {
    return GoalListSchema.parse(data) as Goal[];
  } catch (error) {
    console.error("Erro ao validar lista de metas:", error);
    throw new Error("Resposta do servidor em formato invalido.");
  }
}

function parseGoal(data: unknown): Goal {
  try {
    return GoalSchema.parse(data) as Goal;
  } catch (error) {
    console.error("Erro ao validar meta:", error);
    throw new Error("Resposta do servidor em formato invalido.");
  }
}

function parseContributions(data: unknown): Contribution[] {
  try {
    return ContributionListSchema.parse(data) as Contribution[];
  } catch (error) {
    console.error("Erro ao validar contribuicoes:", error);
    throw new Error("Resposta do servidor em formato invalido.");
  }
}

function parsePixPayload(data: unknown): PixPayload {
  try {
    return PixPayloadSchema.parse(data) as PixPayload;
  } catch (error) {
    console.error("Erro ao validar payload PIX:", error);
    throw new Error("Resposta do servidor em formato invalido.");
  }
}

// API Calls
export async function fetchGoals(): Promise<Goal[]> {
  const { data } = await api.get("/goals");
  return parseGoals(data.data);
}

export async function fetchGoalById(id: string): Promise<Goal> {
  const { data } = await api.get(`/goals/${id}`);
  return parseGoal(data.data);
}

export async function createGoal(payload: CreateGoalPayload): Promise<Goal> {
  const { data } = await api.post("/goals", payload);
  return parseGoal(data.data);
}

export async function updateGoal(id: string, payload: UpdateGoalPayload): Promise<Goal> {
  const { data } = await api.put(`/goals/${id}`, payload);
  return parseGoal(data.data);
}

export async function deleteGoal(id: string): Promise<void> {
  await api.delete(`/goals/${id}`);
}

// Participants
export async function addParticipant(goalId: string, userId: string) {
  const { data } = await api.post(`/goals/${goalId}/participants`, { user_id: userId });
  return data.data;
}

export async function removeParticipant(goalId: string, userId: string) {
  await api.delete(`/goals/${goalId}/participants/${userId}`);
}

export async function inviteByEmail(goalId: string, email: string) {
  const { data } = await api.post(`/goals/${goalId}/invite`, { email });
  return data.data;
}

// Contributions
export async function fetchContributions(goalId: string): Promise<Contribution[]> {
  const { data } = await api.get(`/goals/${goalId}/contributions`);
  return parseContributions(data.data);
}

export async function fetchMyContributions(goalId: string): Promise<Contribution[]> {
  const { data } = await api.get(`/goals/${goalId}/contributions/my`);
  return parseContributions(data.data);
}

// PIX
export async function fetchPixPayload(goalId: string, contributionId: string): Promise<PixPayload> {
  const { data } = await api.get(`/goals/${goalId}/pix/${contributionId}`);
  return parsePixPayload(data.data);
}
