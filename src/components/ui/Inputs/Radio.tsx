import React from "react";
import { Pressable, View as RNView, StyleSheet } from "react-native";
import { Controller } from "react-hook-form";
import { theme } from "@theme";
import { InputWrapper } from "./InputStyles";
import { Text } from "../Text";

interface Option {
  label: string;
  value: string;
}

interface InputRadioProps {
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: any;
  label?: string;
  options: Option[];
}

export function InputRadio({ name, control, label, options }: InputRadioProps) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <InputWrapper label={label} error={error?.message}>
          <RNView style={styles.container}>
            {options.map((option) => {
              const isSelected = value === option.value;
              return (
                <Pressable
                  key={option.value}
                  onPress={() => onChange(option.value)}
                  style={styles.option}
                >
                  <RNView style={[styles.radio, isSelected && styles.radioSelected]}>
                    {isSelected && <RNView style={styles.radioInner} />}
                  </RNView>
                  <Text type="paragrafo">{option.label}</Text>
                </Pressable>
              );
            })}
          </RNView>
        </InputWrapper>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: theme.border.gray,
    alignItems: "center",
    justifyContent: "center",
  },
  radioSelected: {
    borderColor: theme.colors.secundary,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: theme.colors.secundary,
  },
});
