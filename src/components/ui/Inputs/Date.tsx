import { theme } from "@/theme";
import { AntDesign } from "@expo/vector-icons";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { format as formatDateFns } from "date-fns";
import React from "react";
import { Control, Controller, RegisterOptions } from "react-hook-form";
import {
  Platform,
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import Text from "../Text";
import { InputStyles } from "./InputStyles";

type Props = {
  name: string;
  control: Control<any>;
  rules?: RegisterOptions;
  placeholder?: string;
  label?: string;
  defaultValue?: Date;
  icon?: React.JSX.Element;
  style?: StyleProp<ViewStyle>;
  error?: string | null;
  callback?: (date: Date) => void;
  mode?: InputMode;
  minimumDate?: Date;
  maximumDate?: Date;
  editable?: boolean;
};

type InputMode = "date" | "time" | "datetime";
type AndroidDateTimeStep = "date" | "time";

const formatDate = (
  date: Date | null | undefined,
  mode: InputMode = "date",
): string => {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
    return "";
  }

  try {
    if (mode === "time") {
      return date.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    if (mode === "datetime") {
      return date.toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        dateStyle: "long",
        timeStyle: "short",
      });
    }

    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return "";
  }
};

const parseFieldValueToDate = (
  rawValue: unknown,
  currentMode: InputMode,
): Date | null => {
  if (!rawValue) return null;
  if (rawValue instanceof Date) {
    return isNaN(rawValue.getTime()) ? null : rawValue;
  }

  const strValue = String(rawValue);

  // Evita bug de timezone para formato yyyy-MM-dd
  if (currentMode === "date") {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(strValue);
    if (match) {
      const [, y, m, d] = match;
      const localDate = new Date(Number(y), Number(m) - 1, Number(d));
      return isNaN(localDate.getTime()) ? null : localDate;
    }
  }

  const parsed = new Date(strValue);
  return isNaN(parsed.getTime()) ? null : parsed;
};

const formatOutputByMode = (date: Date, mode: InputMode): string => {
  if (mode === "date") return formatDateFns(date, "yyyy-MM-dd");
  if (mode === "time") return formatDateFns(date, "HH:mm");
  return formatDateFns(date, "yyyy-MM-dd'T'HH:mm");
};

const mergeDateAndTime = (baseDate: Date, timeSource: Date): Date => {
  const merged = new Date(baseDate);
  merged.setHours(timeSource.getHours(), timeSource.getMinutes(), 0, 0);
  return merged;
};

const getPickerDisplay = (mode: InputMode) => {
  // IMPORTANTE:
  // - iOS aceita: "default" | "spinner" | "compact" | "inline"
  // - Android aceita: "default" | "spinner" | "calendar" | "clock"
  // Passar "calendar" no iOS faz o native module abortar (SIGABRT) ao converter o enum.
  if (Platform.OS === "ios") return "spinner" as const;
  return "default" as const;
};

export default function InputDate({
  name,
  control,
  rules,
  placeholder = "Selecione uma data",
  label,
  defaultValue,
  style,
  error,
  icon,
  callback,
  mode = "date",
  minimumDate,
  maximumDate,
  editable = true,
}: Props) {
  const [show, setShow] = React.useState(false);
  const [isFocused, setIsFocused] = React.useState(false);
  const [androidDateTimeStep, setAndroidDateTimeStep] =
    React.useState<AndroidDateTimeStep>("date");
  const [androidDatePart, setAndroidDatePart] = React.useState<Date | null>(
    null,
  );

  const closePicker = () => {
    setShow(false);
    setIsFocused(false);
  };

  const resetAndroidDateTimeFlow = () => {
    setAndroidDateTimeStep("date");
    setAndroidDatePart(null);
  };

  return (
    <InputStyles label={label} error={error ?? ""} icon={icon} style={style}>
      <Controller
        control={control}
        name={name}
        rules={rules}
        defaultValue={defaultValue}
        render={({ field: { onChange, value } }) => {
          const dateValue = parseFieldValueToDate(value, mode);
          const displayValue = formatDate(dateValue, mode);
          const pickerMode =
            Platform.OS === "android" && mode === "datetime"
              ? androidDateTimeStep
              : mode;
          const pickerDisplay = getPickerDisplay(mode);
          const pickerValue =
            Platform.OS === "android" &&
            mode === "datetime" &&
            androidDateTimeStep === "time"
              ? androidDatePart || dateValue || new Date()
              : dateValue || new Date();

          const applyValue = (nextDate: Date, outputMode: InputMode = mode) => {
            onChange(formatOutputByMode(nextDate, outputMode));
            callback?.(nextDate);
          };

          const handleAndroidDateTimeChange = (
            event: DateTimePickerEvent,
            selectedDate?: Date,
          ) => {
            if (event.type === "dismissed") {
              closePicker();
              resetAndroidDateTimeFlow();
              return;
            }

            if (event.type !== "set" || !selectedDate) {
              return;
            }

            if (androidDateTimeStep === "date") {
              const baseDate = dateValue || new Date();
              const mergedDate = mergeDateAndTime(selectedDate, baseDate);
              setAndroidDatePart(mergedDate);
              setAndroidDateTimeStep("time");
              setShow(true);
              return;
            }

            const baseDate = androidDatePart || dateValue || new Date();
            const mergedDateTime = mergeDateAndTime(baseDate, selectedDate);
            applyValue(mergedDateTime, "datetime");
            closePicker();
            resetAndroidDateTimeFlow();
          };

          const handleDefaultChange = (
            event: DateTimePickerEvent,
            selectedDate?: Date,
          ) => {
            if (Platform.OS === "android") {
              setShow(false);
            }

            if (event.type === "set" && selectedDate) {
              applyValue(selectedDate);
              setIsFocused(false);
              return;
            }

            if (event.type === "dismissed") {
              closePicker();
            }
          };

          const handleChange = (
            event: DateTimePickerEvent,
            selectedDate?: Date,
          ) => {
            if (Platform.OS === "android" && mode === "datetime") {
              handleAndroidDateTimeChange(event, selectedDate);
              return;
            }

            handleDefaultChange(event, selectedDate);
          };

          const handlePress = () => {
            if (editable) {
              if (Platform.OS === "android" && mode === "datetime") {
                setAndroidDateTimeStep("date");
                setAndroidDatePart(dateValue || new Date());
              }
              setShow(true);
              setIsFocused(true);
            }
          };

          if (editable === false) {
            return (
              <Text
                style={[styles.input, { paddingVertical: 12, opacity: 0.4 }]}
              >
                {displayValue || placeholder}
              </Text>
            );
          }

          return (
            <View>
              <Pressable
                onPress={handlePress}
                style={[
                  styles.input,
                  error ? styles.inputError : null,
                  isFocused && styles.inputFocused,
                ]}
              >
                <Text
                  style={[
                    styles.inputText,
                    !displayValue && styles.placeholderText,
                  ]}
                >
                  {displayValue || placeholder}
                </Text>
                <AntDesign
                  name="calendar"
                  size={20}
                  color={theme.colors.gray}
                  style={styles.calendarIcon}
                />
              </Pressable>

              {show && (
                <DateTimePicker
                  value={pickerValue}
                  mode={pickerMode}
                  display={pickerDisplay}
                  onChange={handleChange}
                  minimumDate={minimumDate}
                  maximumDate={maximumDate}
                  minuteInterval={5}
                  locale="pt-BR"
                  {...(Platform.OS === "ios" && {
                    themeVariant: "dark",
                  })}
                />
              )}

              {Platform.OS === "ios" && show && (
                <View style={styles.iosButtonContainer}>
                  <Pressable
                    onPress={() => {
                      closePicker();
                    }}
                    style={styles.iosButton}
                  >
                    <Text style={styles.iosButtonText}>Confirmar</Text>
                  </Pressable>
                </View>
              )}
            </View>
          );
        }}
      />
    </InputStyles>
  );
}

const styles = StyleSheet.create({
  input: {
    paddingVertical: 14,
    paddingHorizontal: 15,
    minHeight: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 5,
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
  inputText: {
    flex: 1,
    color: theme.colors.white,
    fontSize: 16,
    fontFamily: "Montserrat-Medium",
  },
  placeholderText: {
    color: theme.colors.gray,
  },
  calendarIcon: {
    marginLeft: 8,
  },
  iosButtonContainer: {
    marginTop: 8,
    alignItems: "flex-end",
  },
  iosButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  iosButtonText: {
    color: "#fff",
    fontFamily: "Montserrat-SemiBold",
    fontSize: 14,
  },
});
