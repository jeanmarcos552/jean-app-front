import React, { useState } from "react";
import {
  Pressable,
  FlatList,
  Modal,
  StyleSheet,
  View as RNView,
} from "react-native";
import { Controller } from "react-hook-form";
import { theme } from "@theme";
import { InputWrapper, inputBaseStyles } from "./InputStyles";
import { Text } from "../Text";

interface Option {
  label: string;
  value: string;
}

interface InputSelectProps {
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: any;
  label?: string;
  placeholder?: string;
  options: Option[];
}

export function InputSelect({
  name,
  control,
  label,
  placeholder = "Selecione",
  options,
}: InputSelectProps) {
  const [visible, setVisible] = useState(false);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        const selected = options.find((o) => o.value === value);

        return (
          <InputWrapper label={label} error={error?.message}>
            <Pressable
              onPress={() => setVisible(true)}
              style={[inputBaseStyles.input, error?.message ? inputBaseStyles.error : undefined]}
            >
              <Text type="paragrafo" color={selected ? "white" : "gray"}>
                {selected?.label || placeholder}
              </Text>
            </Pressable>

            <Modal visible={visible} transparent animationType="fade">
              <Pressable style={styles.overlay} onPress={() => setVisible(false)}>
                <RNView style={styles.modal}>
                  <Text type="titulo" style={styles.modalTitle}>
                    {label || "Selecione"}
                  </Text>
                  <FlatList
                    data={options}
                    keyExtractor={(item) => item.value}
                    renderItem={({ item }) => (
                      <Pressable
                        onPress={() => {
                          onChange(item.value);
                          setVisible(false);
                        }}
                        style={[
                          styles.option,
                          item.value === value && styles.selectedOption,
                        ]}
                      >
                        <Text
                          type="paragrafo"
                          color={item.value === value ? "secundary" : "white"}
                        >
                          {item.label}
                        </Text>
                      </Pressable>
                    )}
                  />
                </RNView>
              </Pressable>
            </Modal>
          </InputWrapper>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    padding: 24,
  },
  modal: {
    backgroundColor: theme.background.black,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.border.black,
    padding: 16,
    maxHeight: 400,
  },
  modalTitle: {
    marginBottom: 12,
  },
  option: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  selectedOption: {
    backgroundColor: theme.background.primary,
  },
});
