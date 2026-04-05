import { api } from "@/lib/api";
import { Notification } from "@/types/notification";

export async function fetchNotifications(unread?: boolean): Promise<Notification[]> {
  const params = unread ? { unread: "true" } : {};
  const { data } = await api.get("/notifications", { params });
  return data.data as Notification[];
}

export async function markAsRead(id: string): Promise<void> {
  await api.patch(`/notifications/${id}/read`);
}

export async function markAllAsRead(): Promise<void> {
  await api.patch("/notifications/read-all");
}
