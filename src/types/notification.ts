export type NotificationType =
  | "payment_reminder"
  | "invite"
  | "invite_declined"
  | "late"
  | "removal";

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  payload: Record<string, any>;
  read_at: string | null;
  created_at: string;
}
