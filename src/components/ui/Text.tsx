import { ColorsType, theme } from "@/theme";
import React from "react";
import {
  Text as RNText,
  StyleProp,
  StyleSheet,
  TextProps,
  TextStyle,
} from "react-native";

export type TextPropss = TextProps & {
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
  type?: keyof typeof styles;
  color?: ColorsType;
};

const Text = ({ children, style, ...rest }: TextPropss) => {
  const flattenedStyle = StyleSheet.flatten(style);

  return (
    <RNText
      style={StyleSheet.flatten([
        styles[rest.type ?? "paragrafo"],
        !flattenedStyle?.color && {
          color: rest.color ? theme.colors[rest.color] : theme.colors.white,
        },
        style,
      ])}
      {...rest}
    >
      {children}
    </RNText>
  );
};

const styles = StyleSheet.create({
  titulo: {
    fontFamily: theme.fonts.titulo,
    fontSize: 20,
    fontWeight: "700",
  },
  subtitulo: {
    fontFamily: theme.fonts.subtitulo,
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.gray,
  },
  paragrafo: {
    fontFamily: theme.fonts.body,
  },
  link: {
    fontFamily: theme.fonts.body,
    color: theme.colors.primary,
    textDecorationLine: "underline",
    fontSize: 14,
  },
  small: {
    fontFamily: theme.fonts.titulo,
    fontSize: 12,
  },
});

export default Text;
