import React from "react";

import { theme } from "@/theme";
import { AntDesign } from "@expo/vector-icons";
import { Platform, StyleSheet } from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeOut,
  FadeOutUp,
} from "react-native-reanimated";
import { Card } from "../Card";
import Text from "../Text";
import View from "../View";
import { Header } from "./Header";
import { RootLayout, RootProps } from "./Root";
import { Separator } from "./Separator";

type ErrorProps = RootProps & {
  children?: React.ReactNode;
  color?: keyof typeof theme.background;
  mensage?: string;
  header?: React.ReactNode;
};
export const Error = ({
  children,
  mensage,
  color = "danger",
  header,
  ...rest
}: ErrorProps) => {
  return (
    <RootLayout {...rest}>
      <Header title="Voltar" />
      {header && header}
      <View style={styles.full}>
        <Card.Icon size="large" variant={color} style={styles.loading}>
          <Animated.View
            entering={FadeIn.delay(300)}
            exiting={FadeOut.delay(300)}
          >
            <AntDesign
              name="close-circle"
              color={theme.colors[color]}
              size={38}
            />
          </Animated.View>
        </Card.Icon>
        {mensage && (
          <Animated.View entering={FadeInDown} exiting={FadeOutUp}>
            <Text
              type="subtitulo"
              style={{ textAlign: "center" }}
              color={color}
            >
              {mensage}
            </Text>
          </Animated.View>
        )}

        {children ?? children}
        <Separator size={Platform.OS === "ios" ? 4 : 12} />
      </View>
    </RootLayout>
  );
};

const styles = StyleSheet.create({
  full: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 8,
    gap: 22,
  },
  loading: {
    justifyContent: "center",
    alignItems: "center",
  },
});
