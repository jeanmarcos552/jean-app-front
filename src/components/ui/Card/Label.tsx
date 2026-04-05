import { money } from "@/helper/Mask";
import { BackgroundType } from "@/theme";
import React from "react";
import { StyleSheet, View } from "react-native";
import Text from "../Text";

type ComponentsProps = {
  children: React.ReactNode;
  variant?: BackgroundType;
  title?: string;
  before?: string;
  after?: string;
  textStyle?: "bold" | "normal" | "light";
  type?: "normal" | "money" | "percentage";
};

function RenderChildren({
  type: type,
  value,
}: {
  type: ComponentsProps["type"];
  value: React.ReactNode;
}) {
  if (typeof value === "string") {
    return value;
  }
  if (typeof value === "number") {
    if (type === "money") {
      return money(value);
    }
    if (type === "percentage") {
      return `${value.toFixed(2)}%`;
    }
  }

  return value;
}
export function Label({
  children,
  title,
  before,
  after,
  textStyle = "normal",
  type = "normal",
}: ComponentsProps) {
  return (
    <View style={[styles.container]}>
      {title && (
        <Text type="small" color="gray">
          {title}
        </Text>
      )}
      {before && (
        <Text type="small" color="gray">
          {before}
        </Text>
      )}

      <Text style={[stylesBold[textStyle]]}>
        <RenderChildren type={type} value={children} />

        {after && (
          <Text type="small" color="gray">
            {" "}
            {after}
          </Text>
        )}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "space-between",
    position: "relative",
  },
  subtitleContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "flex-end",
  },
});

const stylesBold = StyleSheet.create({
  bold: {
    fontWeight: "bold",
  },
  normal: {
    fontWeight: "normal",
  },
  light: {
    fontWeight: "300",
  },
});
