import { theme } from "@/theme";
import React, { useState } from "react";
import {
   ActivityIndicator,
   ImageBackground,
   ImageBackgroundProps,
   ImageURISource,
   StyleProp,
   StyleSheet,
   ViewStyle,
} from "react-native";
import View from "../View";

type ImageProps = ImageBackgroundProps & {
  source: ImageURISource;
  scale?: number;
  aspectRatio?: number; // Ex: 16/9, 4/3, 1, 3/4
  children?: React.ReactNode;
  styleChildren?: StyleProp<ViewStyle>;
};
export const Image = ({
  style,
  source,
  aspectRatio,
  children,
  styleChildren,
  ...rest
}: ImageProps) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const imageStyle = [
    styles.image,
    aspectRatio ? { aspectRatio } : undefined,
    style,
  ];

  if (rest && source && source.uri === "") {
    return <View style={imageStyle} />;
  }

  if (error) return <View style={imageStyle} />;

  return (
    <ImageBackground
      fadeDuration={300}
      borderRadius={8}
      style={imageStyle}
      onError={() => setError(true)}
      onLoad={() => setLoading(false)}
      source={source}
      {...rest}
    >
      {!error && loading ? (
        <View style={[styles.full, styles.center]}>
          <ActivityIndicator color={theme.colors.primary} />
        </View>
      ) : (
        <View style={[styles.full, styleChildren]}>{children}</View>
      )}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  image: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.colors.secundary,
    overflow: "hidden",
    width: "100%",
    height: "auto",
  },
  imgNotFound: {
    backgroundColor: theme.colors.gray,
    alignItems: "center",
    justifyContent: "center",
  },
  full: {
    flex: 1,
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
});
