import React from "react";
import { Text as RNText, TextProps, StyleSheet } from "react-native";
import { theme, ThemeColorKey } from "@theme";

type TextType = "titulo" | "subtitulo" | "paragrafo" | "link" | "small";

interface Props extends TextProps {
  type?: TextType;
  color?: ThemeColorKey;
  children: React.ReactNode;
}

export function Text({ type = "paragrafo", color, style, children, ...rest }: Props) {
  const textColor = color ? theme.colors[color] : undefined;

  return (
    <RNText
      style={[styles.base, styles[type], textColor ? { color: textColor } : undefined, style]}
      {...rest}
    >
      {children}
    </RNText>
  );
}

const styles = StyleSheet.create({
  base: {
    color: theme.colors.white,
  },
  titulo: {
    fontFamily: theme.fonts.titulo,
    fontSize: 20,
    fontWeight: "700",
    color: theme.colors.white,
  },
  subtitulo: {
    fontFamily: theme.fonts.subtitulo,
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.gray,
  },
  paragrafo: {
    fontFamily: theme.fonts.body,
    fontSize: 14,
    color: theme.colors.white,
  },
  link: {
    fontFamily: theme.fonts.body,
    fontSize: 14,
    textDecorationLine: "underline",
    color: theme.colors.secundary,
  },
  small: {
    fontFamily: theme.fonts.titulo,
    fontSize: 12,
    color: theme.colors.white,
  },
});
