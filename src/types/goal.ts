export type GoalStatus = "active" | "completed" | "cancelled";
export type ValueType = "money" | "percentage";
export type ReminderFrequency = "daily" | "weekly" | "monthly" | "yearly";
export type ParticipantRole = "owner" | "member";
export type ParticipantStatus = "active" | "invited" | "declined" | "removed";
export type ContributionStatus = "pending" | "paid" | "late" | "pending_review";

export interface GoalParticipant {
  id: string;
  goal_id: string;
  user_id: string;
  role: ParticipantRole;
  status: ParticipantStatus;
  late_count: number;
  joined_at: string | null;
  created_at: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export interface Goal {
  id: string;
  owner_id: string;
  name: string;
  description: string | null;
  end_date: string;
  value_type: ValueType;
  total_value: string;
  reminder_frequency: ReminderFrequency;
  status?: GoalStatus;
  categories: string[];
  current_value?: string | number;
  progress_percentage?: string | number;
  created_at: string;
  updated_at: string;
  owner?: {
    id: string;
    name: string;
    email: string;
  };
  goal_participants?: GoalParticipant[];
}

export interface Contribution {
  id: string;
  goal_id: string;
  user_id: string;
  installment_no: number;
  amount: string;
  txid: string;
  status: ContributionStatus;
  due_date: string;
  paid_at: string | null;
  transaction_id: string | null;
  generation: number;
  created_at: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface PixPayload {
  pix_copy_paste: string;
  qr_code_base64: string;
  amount: string;
  due_date: string;
  txid: string;
}

export interface CreateGoalPayload {
  name: string;
  description?: string;
  end_date: string;
  value_type: ValueType;
  total_value: number;
  reminder_frequency: ReminderFrequency;
  categories: string[];
}

export interface UpdateGoalPayload {
  name?: string;
  description?: string;
  end_date?: string;
  total_value?: number;
  reminder_frequency?: ReminderFrequency;
  categories?: string[];
}
