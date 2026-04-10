import { theme } from "@/theme";
import React, { useState } from "react";
import { Controller, RegisterOptions } from "react-hook-form";
import {
   ActivityIndicator,
   KeyboardTypeOptions,
   Platform,
   StyleProp,
   StyleSheet,
   TextInput,
   TextInputProps,
   ViewStyle,
} from "react-native";
import Text from "../Text";
import View from "../View";
import { InputStyles } from "./InputStyles";

type Mask =
  | "none"
  | "cep"
  | "cpf"
  | "cnpj"
  | "telefone"
  | "celular"
  | "currency"
  | "date";

type Props = TextInputProps & {
  name: string;
  control: any;
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

export function TextArea({
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
  ...inputProps
}: Props) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <InputStyles label={label} error={error ?? ""} icon={icon} style={style}>
      <Controller
        control={control}
        name={name}
        rules={rules}
        defaultValue={defaultValue}
        render={({ field: { onChange, onBlur, value } }) => {
          if (editable === false) {
            return (
              <Text
                style={[
                  stylesInput.input,
                  { paddingVertical: 12, opacity: 0.4 },
                ]}
              >
                {value}
              </Text>
            );
          }

          return (
            <View style={stylesInput.container}>
              <TextInput
                style={[
                  stylesInput.input,
                  error ? stylesInput.inputError : null,
                  isFocused && stylesInput.inputFocused,
                ]}
                placeholder={placeholder}
                value={value}
                onChangeText={onChange}
                onBlur={(e) => {
                  setIsFocused(false);
                  callback?.(value);
                  onBlur();
                }}
                multiline
                numberOfLines={Platform.OS === "android" ? 4 : 0}
                onFocus={() => setIsFocused(true)}
                placeholderTextColor={theme.colors.gray}
                editable={editable}
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
  },
  inputFocused: {
    borderColor: theme.colors.white,
  },
});
