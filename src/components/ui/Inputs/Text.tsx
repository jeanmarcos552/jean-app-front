import React, { useState } from "react";
import { TextInput, ActivityIndicator, StyleSheet } from "react-native";
import { Controller, RegisterOptions } from "react-hook-form";
import { theme } from "@theme";
import { InputWrapper, inputBaseStyles } from "./InputStyles";
import { applyMask, unmask, MaskType } from "@/helper/Mask";

interface InputTextProps {
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: any;
  rules?: RegisterOptions;
  mask?: MaskType;
  placeholder?: string;
  label?: string;
  defaultValue?: string;
  keyboardType?: "default" | "numeric" | "email-address" | "phone-pad" | "decimal-pad";
  secureTextEntry?: boolean;
  returnRaw?: boolean;
  maxLength?: number;
  icon?: React.ReactNode;
  error?: string;
  loading?: boolean;
  callback?: (value: string) => void;
}

export function InputText({
  name,
  control,
  rules,
  mask = "none",
  placeholder,
  label,
  defaultValue = "",
  keyboardType = "default",
  secureTextEntry = false,
  returnRaw = false,
  maxLength,
  icon,
  error: externalError,
  loading = false,
  callback,
}: InputTextProps) {
  const [focused, setFocused] = useState(false);

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      rules={rules}
      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => {
        const displayValue = mask !== "none" ? applyMask(value || "", mask) : value || "";
        const errorMessage = externalError || error?.message;

        const handleChange = (text: string) => {
          const masked = mask !== "none" ? applyMask(text, mask) : text;
          const finalValue = returnRaw && mask !== "none" ? unmask(text) : masked;
          onChange(finalValue);
          callback?.(finalValue);
        };

        return (
          <InputWrapper label={label} error={errorMessage} icon={icon}>
            <TextInput
              value={displayValue}
              onChangeText={handleChange}
              onBlur={() => {
                setFocused(false);
                onBlur();
              }}
              onFocus={() => setFocused(true)}
              placeholder={placeholder}
              placeholderTextColor={theme.colors.gray}
              keyboardType={keyboardType}
              secureTextEntry={secureTextEntry}
              maxLength={maxLength}
              style={[
                inputBaseStyles.input,
                icon ? inputBaseStyles.withIcon : undefined,
                focused && inputBaseStyles.focused,
                errorMessage ? inputBaseStyles.error : undefined,
              ]}
            />
            {loading && (
              <ActivityIndicator
                size="small"
                color={theme.colors.secundary}
                style={styles.loader}
              />
            )}
          </InputWrapper>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  loader: {
    position: "absolute",
    right: 12,
    top: 14,
  },
});
