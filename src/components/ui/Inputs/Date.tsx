import React, { useState } from "react";
import { Pressable, Platform, StyleSheet } from "react-native";
import { Controller } from "react-hook-form";
import DateTimePicker from "@react-native-community/datetimepicker";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { theme } from "@theme";
import { InputWrapper, inputBaseStyles } from "./InputStyles";
import { Text } from "../Text";

interface InputDateProps {
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: any;
  label?: string;
  placeholder?: string;
  minimumDate?: Date;
  maximumDate?: Date;
}

export function InputDate({
  name,
  control,
  label,
  placeholder = "Selecione uma data",
  minimumDate,
  maximumDate,
}: InputDateProps) {
  const [show, setShow] = useState(false);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        const dateValue = value ? new Date(value) : undefined;
        const displayText = dateValue
          ? format(dateValue, "dd/MM/yyyy", { locale: ptBR })
          : placeholder;

        return (
          <InputWrapper label={label} error={error?.message}>
            <Pressable
              onPress={() => setShow(true)}
              style={[inputBaseStyles.input, error?.message ? inputBaseStyles.error : undefined]}
            >
              <Text
                type="paragrafo"
                color={dateValue ? "white" : "gray"}
              >
                {displayText}
              </Text>
            </Pressable>

            {show && (
              <DateTimePicker
                value={dateValue || new Date()}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                minimumDate={minimumDate}
                maximumDate={maximumDate}
                onChange={(_, selectedDate) => {
                  setShow(Platform.OS === "ios");
                  if (selectedDate) {
                    onChange(selectedDate.toISOString().split("T")[0]);
                  }
                }}
              />
            )}
          </InputWrapper>
        );
      }}
    />
  );
}
