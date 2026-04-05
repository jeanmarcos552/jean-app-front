import { Colors } from "@/constants/theme";
import React from "react";
import { StyleSheet } from "react-native";
import Flex from "../Flex";
import Text, { TextPropss } from "../Text";

type TitleProps = {
  children: React.ReactNode;
  style?: TextPropss["style"];
  variant?: keyof typeof styles;
  before?: string;
  after?: string;
};
export const Title = ({
  children,
  style,
  before,
  after,
  ...rest
}: TitleProps) => {
  return (
    <Flex>
      <Text
        type="subtitulo"
        style={[styles[rest.variant ?? "white"], style]}
        {...rest}
      >
        {before && (
          <Text type="small" style={[stylesAfter.primary]}>
            {before}
            {"\n"}
          </Text>
        )}
        {children}
        {after && (
          <Text type="small" style={[stylesAfter.primary]}>
            {"\n"}
            {after}
          </Text>
        )}
      </Text>
    </Flex>
  );
};

const styles: any = StyleSheet.create({
  primary: {
    color: "#111111",
  },
  secundary: {
    color: Colors.gray,
  },
  warning: {
    color: "#f59e0b",
  },
  info: {
    color: "#0f6df0",
  },
  success: {
    color: "rgb(77, 207, 166)",
  },
  danger: {
    color: "#ef4444",
  },
  gray: {
    color: "#b6b6b6",
  },
  black: {
    color: Colors.gray,
  },
  white: {
    color: Colors.gray,
  },
});

const stylesAfter: any = StyleSheet.create({
  primary: {
    color: "#818181",
    fontStyle: "italic",
  },
});
