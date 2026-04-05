import { theme } from "@/theme";
import AntDesign from "@expo/vector-icons/AntDesign";
import React from "react";
import { StyleProp, StyleSheet, ViewStyle } from "react-native";
import { Card } from "../Card";
import Text from "../Text";
import View from "../View";

type InputStylesProps = {
  children?: React.ReactNode;
  label?: string;
  error?: string;
  icon?: React.JSX.Element;
  style?: StyleProp<ViewStyle>;
};

function CreateIcon({
  icon,
  error,
}: {
  icon?: React.JSX.Element;
  error?: string;
}) {
  if (React.isValidElement(icon)) {
    return React.cloneElement(icon as React.JSX.Element, {
      size: 12.5,
      color: !!error ? theme.colors.danger : theme.colors.primary,
    });
  }

  return null;
}

export const InputStyles = ({
  children,
  label,
  error,
  icon,
  style,
}: InputStylesProps) => {
  return (
    <View style={[styles.container]}>
      <View style={style}>
        {label ? (
          <View variant="row" style={styles.center}>
            {icon ? (
              <Card.Icon variant={error ? "danger" : "black"} size="small">
                <CreateIcon icon={icon!} error={error!} />
              </Card.Icon>
            ) : null}
            <Text type="small" color={error ? "danger" : "gray"}>
              {label}
            </Text>
          </View>
        ) : null}

        {children}
      </View>

      {error ? (
        <View variant="row" style={styles.center}>
          <AntDesign name="warning" size={12} color={theme.colors.danger} />

          <Text type="small" color="danger">
            {error}
          </Text>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "flex-start",
  },
  label: {
    marginBottom: 6,
    color: theme.colors.primary,
    fontSize: 14,
  },
  center: {
    alignItems: "center",
    flexDirection: "row",
    gap: 6,
    paddingTop: 2,
  },
});
