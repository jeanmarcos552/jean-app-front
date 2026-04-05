import React from "react";
import { Switch as RNSwitch, View as RNView, StyleSheet } from "react-native";
import { Controller } from "react-hook-form";
import { theme } from "@theme";
import { InputWrapper } from "./InputStyles";
import { Text } from "../Text";

interface InputSwitchProps {
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: any;
  label?: string;
}

export function InputSwitch({ name, control, label }: InputSwitchProps) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <InputWrapper error={error?.message}>
          <RNView style={styles.container}>
            {label && <Text type="paragrafo">{label}</Text>}
            <RNSwitch
              value={!!value}
              onValueChange={onChange}
              trackColor={{
                false: theme.border.gray,
                true: theme.colors.secundary,
              }}
              thumbColor="#fff"
            />
          </RNView>
        </InputWrapper>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
