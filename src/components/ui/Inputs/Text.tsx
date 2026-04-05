import {
   birthDayMask,
   cnpjMask,
   cpfMask,
   emailOrCpfMask,
   maskCEP,
   phoneMask,
} from "@/helper/Mask";
import { theme } from "@/theme";
import React from "react";
import { Control, Controller, RegisterOptions } from "react-hook-form";
import {
   ActivityIndicator,
   KeyboardTypeOptions,
   StyleProp,
   StyleSheet,
   TextInput,
   TextInputProps,
   View,
   ViewStyle,
} from "react-native";
import Text from "../Text";
import { InputStyles } from "./InputStyles";

type Mask =
  | "none"
  | "cep"
  | "cpf"
  | "cnpj"
  | "telefone"
  | "celular"
  | "currency"
  | "date"
  | "emailOrCpf";

type Props = TextInputProps & {
  name: string;
  control: Control<any>;
  rules?: RegisterOptions;
  mask?: Mask;
  placeholder?: string;
  label?: string;
  defaultValue?: string;
  keyboardType?: KeyboardTypeOptions;
  secureTextEntry?: boolean;
  returnRaw?: boolean;
  maxLength?: number;
  icon?: React.JSX.Element;
  style?: StyleProp<ViewStyle>;
  error?: string | null;
  inputProps?: Omit<TextInputProps, "onChangeText" | "value">;
  callback?: (val: string) => void;
  loading?: boolean;
};

const onlyDigits = (s = "") => s.replace(/\D+/g, "");

const formatMask = (value = "", mask: Mask) => {
  let digits = value;

  if (mask !== "emailOrCpf") {
    digits = onlyDigits(value);
  }

  switch (mask) {
    case "cep":
      return maskCEP(digits);
    case "cpf":
      return cpfMask(digits);
    case "emailOrCpf":
      return emailOrCpfMask(digits);
    case "cnpj":
      return cnpjMask(digits);
    case "telefone":
    case "celular":
      return phoneMask(digits);
    case "date":
      return birthDayMask(digits);
    case "currency": {
      const v = onlyDigits(value);
      if (v.length === 0) return "";
      const num = Number(v) / 100;

      // Proteção contra NaN e Infinity
      if (!Number.isFinite(num)) {
        return "R$ 0,00";
      }

      try {
        return new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(num);
      } catch {
        return `R$ ${num.toFixed(2).replace(".", ",")}`;
      }
    }
    case "none":
    default:
      return value;
  }
};

const unmaskValue = (value = "", mask: Mask) => {
  if (mask === "currency") {
    const digits = onlyDigits(value);
    if (!digits) return null;
    return Number(digits) / 100;
  }
  return onlyDigits(value);
};

export default function InputText({
  name,
  control,
  rules,
  mask = "none",
  placeholder,
  label,
  defaultValue = "",
  keyboardType = "default",
  returnRaw = false,
  style,
  error,
  icon,
  editable,
  callback,
  loading,
  children,
  autoFocus,
  ...inputProps
}: Props) {
  const [isFocused, setIsFocused] = React.useState(false);
  const inputRef = React.useRef<TextInput>(null);

  React.useEffect(() => {
    if (autoFocus && inputRef.current) {
      const time = setTimeout(() => {
        inputRef.current?.focus();
      }, 500);
      return () => clearTimeout(time);
    }
  }, [autoFocus]);

  return (
    <InputStyles label={label} error={error ?? ""} icon={icon} style={style}>
      <Controller
        control={control}
        name={name}
        rules={rules}
        defaultValue={defaultValue}
        render={({ field: { onChange, onBlur, value } }) => {
          const displayValue = formatMask(value ?? defaultValue, mask);

          const handleChange = (text: string) => {
            const masked = formatMask(text, mask);
            if (returnRaw) {
              const raw = unmaskValue(masked, mask);
              onChange(raw ?? "");
            } else {
              onChange(masked);
            }
          };
          if (editable === false) {
            return (
              <Text
                style={[
                  stylesInput.input,
                  { paddingVertical: 12, opacity: 0.4 },
                ]}
              >
                {displayValue}
              </Text>
            );
          }

          return (
            <View>
              <TextInput
                ref={inputRef}
                style={[
                  stylesInput.input,
                  error ? stylesInput.inputError : null,
                  isFocused && stylesInput.inputFocused,
                ]}
                placeholder={placeholder}
                value={displayValue}
                onChangeText={handleChange}
                onBlur={(e) => {
                  setIsFocused(false);
                  callback?.(value);
                  onBlur();
                }}
                onFocus={() => setIsFocused(true)}
                placeholderTextColor={theme.colors.gray}
                editable={editable}
                keyboardType={mask === "currency" ? "numeric" : keyboardType}
                {...inputProps}
              />
              {loading && (
                <ActivityIndicator
                  style={stylesInput.activityIndicator}
                  animating={loading}
                  size="small"
                  color={theme.colors.secundary}
                />
              )}
              {children && !loading && (
                <View style={stylesInput.childrenStyle}>{children}</View>
              )}
            </View>
          );
        }}
      />
    </InputStyles>
  );
}

export const stylesInput = StyleSheet.create({
  container: {
    position: "relative",
  },
  activityIndicator: {
    position: "absolute",
    right: 12,
    top: 16,
  },
  childrenStyle: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    right: 0,
    top: 0,
    bottom: 0,
  },
  input: {
    paddingVertical: 14,
    paddingHorizontal: 15,
    minHeight: 56,
    justifyContent: "flex-start",
    borderRadius: 5,

    color: theme.colors.white,
    borderColor: "rgb(59, 59, 59)",
    backgroundColor: "rgb(27, 27, 27)",
    borderWidth: 1,
  },
  inputError: {
    borderColor: theme.border.danger,
    // shadowColor: theme.shadows.danger,
    // shadowOffset: Platform.select({
    //    ios: { width: 3, height: 1 },
    //    android: { width: 6, height: 6 }
    // }),
    // shadowOpacity: 1,
    // elevation: Platform.OS === "ios" ? 1 : 10,
  },
  inputFocused: {
    // borderWidth: 0,
    // borderBottomWidth: 1,
    borderColor: theme.colors.white,
    // shadowColor: theme.colors.primary,
    // shadowOffset: Platform.select({
    //    ios: { width: 3, height: 1 },
    //    android: { width: 6, height: 6 }
    // }),
    // shadowOpacity: Platform.OS === "ios" ? 0.4 : 1,
    // elevation: Platform.OS === "ios" ? 0 : 10,
  },
});
