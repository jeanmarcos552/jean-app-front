import { Colors } from "@/constants/theme";
import { theme } from "@/theme";
import { ImageBackground, ImageSource } from "expo-image";
import React, { ReactNode } from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Loading } from "./Loading";

export type RootProps = {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  source?: ImageSource | string | number | ImageSource[] | string[] | null;
  backgroundColor?: keyof typeof Colors;
};

export const RootLayout = ({
  children,
  style,
  source,
  backgroundColor,
}: RootProps) => {
  const [loadImage, setLoadImage] = React.useState(true);

  if (source) {
    return (
      <ImageBackground
        source={source}
        style={{ flex: 1 }}
        onLoad={() => setLoadImage(true)}
        onLoadEnd={() => setLoadImage(false)}
        contentFit="cover"
      >
        {loadImage ? (
          <Loading />
        ) : (
          <View style={styles.layer}>
              <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
                {children}
              </SafeAreaView>
          </View>
        )}
      </ImageBackground>
    );
  }

  return (
    <View
      style={StyleSheet.flatten([
        {
          backgroundColor: backgroundColor
            ? Colors[backgroundColor]
            : theme.background.black,
        },
        styles.default,
      ])}
    >
        <SafeAreaView
          style={StyleSheet.flatten([styles.container, style])}
          edges={["top"]} 
        >
          {children}
        </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  default: {
    flex: 1,
    paddingHorizontal: 8,
  },
  container: {
    flex: 1,
  },
  layer: {
    flex: 1,
    backgroundColor: Colors.black,
  },
});
