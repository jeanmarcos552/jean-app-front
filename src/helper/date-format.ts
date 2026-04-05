import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

export function formatDate(dateString: string, pattern = "dd/MM/yyyy"): string {
  const date = parseISO(dateString);
  return format(date, pattern, { locale: ptBR });
}

export function formatDateTime(dateString: string): string {
  const date = parseISO(dateString);
  return format(date, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
}

export function formatDateISO(date: Date): string {
  return format(date, "yyyy-MM-dd");
}
