import React, { useState } from "react";
import { TextInput, StyleSheet } from "react-native";
import { Controller } from "react-hook-form";
import { theme } from "@theme";
import { InputWrapper, inputBaseStyles } from "./InputStyles";

interface InputTextAreaProps {
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: any;
  label?: string;
  placeholder?: string;
  maxLength?: number;
  numberOfLines?: number;
}

export function InputTextArea({
  name,
  control,
  label,
  placeholder,
  maxLength,
  numberOfLines = 4,
}: InputTextAreaProps) {
  const [focused, setFocused] = useState(false);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
        <InputWrapper label={label} error={error?.message}>
          <TextInput
            value={value}
            onChangeText={onChange}
            onBlur={() => {
              setFocused(false);
              onBlur();
            }}
            onFocus={() => setFocused(true)}
            placeholder={placeholder}
            placeholderTextColor={theme.colors.gray}
            maxLength={maxLength}
            multiline
            numberOfLines={numberOfLines}
            textAlignVertical="top"
            style={[
              inputBaseStyles.input,
              styles.textArea,
              focused && inputBaseStyles.focused,
              error?.message ? inputBaseStyles.error : undefined,
            ]}
          />
        </InputWrapper>
      )}
    />
  );
}

const styles = StyleSheet.create({
  textArea: {
    minHeight: 100,
    paddingTop: 14,
  },
});
