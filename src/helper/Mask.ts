export function cpfMask(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  return digits
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

export function cnpjMask(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 14);
  return digits
    .replace(/(\d{2})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1/$2")
    .replace(/(\d{4})(\d{1,2})$/, "$1-$2");
}

export function phoneMask(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 10) {
    return digits
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{4})(\d{1,4})$/, "$1-$2");
  }
  return digits
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d{1,4})$/, "$1-$2");
}

export function birthDayMask(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  return digits
    .replace(/(\d{2})(\d)/, "$1/$2")
    .replace(/(\d{2})(\d)/, "$1/$2");
}

export function maskCEP(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  return digits.replace(/(\d{5})(\d{1,3})$/, "$1-$2");
}

export function money(value: number, withSymbol = false): string {
  const formatted = new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

  return withSymbol ? `R$ ${formatted}` : formatted;
}

export function cpfCnpjMask(value: string): string {
  const digits = value.replace(/\D/g, "");
  if (digits.length <= 11) {
    return cpfMask(value);
  }
  return cnpjMask(value);
}

export function currencyMask(value: string): string {
  const digits = value.replace(/\D/g, "");
  if (!digits) return "";
  const num = parseInt(digits, 10) / 100;
  return money(num, true);
}

export function emailOrCpfMask(value: string): string {
  const onlyDigits = value.replace(/\D/g, "");
  if (onlyDigits.length >= 4 && value === onlyDigits) {
    return cpfMask(value);
  }
  return value;
}

export type MaskType =
  | "none"
  | "cep"
  | "cpf"
  | "cnpj"
  | "telefone"
  | "celular"
  | "currency"
  | "date"
  | "emailOrCpf";

export function applyMask(value: string, mask: MaskType): string {
  switch (mask) {
    case "cpf":
      return cpfMask(value);
    case "cnpj":
      return cnpjMask(value);
    case "telefone":
    case "celular":
      return phoneMask(value);
    case "cep":
      return maskCEP(value);
    case "currency":
      return currencyMask(value);
    case "date":
      return birthDayMask(value);
    case "emailOrCpf":
      return emailOrCpfMask(value);
    default:
      return value;
  }
}

export function unmask(value: string): string {
  return value.replace(/\D/g, "");
}
