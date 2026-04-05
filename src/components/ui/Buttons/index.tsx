import { Colors } from "@/constants/theme";
import { BackgroundType, ColorsType, theme } from "@/theme";
import React from "react";
import {
  ActivityIndicator,
  LayoutRectangle,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";
import { Card } from "../Card";
import Text from "../Text";
import View from "../View";
import {
  sizeStyles,
  sizeTextStyles,
  styles,
  stylesBackground,
  stylesText,
} from "./buttons.style";

export type ButtonProps = TouchableOpacityProps & {
  children?: React.ReactNode;
  style?: StyleProp<TouchableOpacityProps>;
  variant?: keyof typeof stylesBackground;
  color?: ColorsType;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  isLoading?: boolean;
  disabledLoading?: boolean;
  size?: "small" | "medium" | "large" | "link";
  label?: string;
};

const stylesBotao = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
});

type RenderChildrenProps = {
  children: React.ReactNode;
  variant: keyof typeof stylesBackground;
  size: Exclude<ButtonProps["size"], undefined>;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  colorIconVariante: { [key in keyof typeof stylesBackground]: BackgroundType };
  onLayout: (event: { nativeEvent: { layout: LayoutRectangle } }) => void;
  color?: ColorsType;
};

function RenderChildren({
  children,
  variant,
  size,
  iconLeft,
  iconRight,
  colorIconVariante,
  onLayout,
  color,
}: RenderChildrenProps) {
  return (
    <View onLayout={onLayout} style={stylesBotao.button}>
      {iconLeft && (
        <Card.Icon
          variant={colorIconVariante[variant]}
          size="small"
          style={styles.iconContainer}
        >
          {iconLeft}
        </Card.Icon>
      )}
      {typeof children === "string" ? (
        <Text
          style={[
            stylesText[variant],
            sizeTextStyles[size],
            color !== undefined && { color: theme.colors[color] },
          ]}
        >
          {children}
        </Text>
      ) : (
        (children ?? children)
      )}
      {iconRight && (
        <Card.Icon
          variant={colorIconVariante[variant]}
          size="small"
          style={styles.iconContainer}
        >
          {iconRight}
        </Card.Icon>
      )}
    </View>
  );
}

export const Button = ({
  variant = "default",
  color,
  children,
  style,
  iconLeft,
  iconRight,
  isLoading,
  size = "medium",
  disabledLoading = false,
  label,
  ...props
}: ButtonProps) => {
  const [loading, setLoading] = React.useState(isLoading || false);
  const [widthDefault, setWidthDefault] =
    React.useState<LayoutRectangle | null>(null);

  const sizeLoading = {
    small: 10,
    medium: 19,
    large: 19,
    link: 0,
  };

  const colorIconVariante: {
    [key in keyof typeof stylesBackground]: BackgroundType;
  } = {
    default: "danger",
    outline: "primary",
    success: "success",
    link: "secundary",
    dark: "white",
  };
  return (
    <>
      {label && (
        <Text style={{ textAlign: "center", fontSize: 10.5 }} color="white">
          {label}
        </Text>
      )}
      <TouchableOpacity
        activeOpacity={0.7}
        onPressIn={() => {
          if (disabledLoading) {
            return;
          }
          if (isLoading) {
            setLoading(isLoading);
            return;
          }

          setLoading(true);
        }}
        onPressOut={() => {
          setLoading(isLoading || false);
        }}
        disabled={(loading || isLoading) && props.disabled}
        style={[
          stylesBackground[variant],
          sizeStyles[size],
          styles.button,
          {
            opacity: props.disabled ? 0.5 : 1,
          },
          style,
        ]}
        {...props}
      >
        {loading || isLoading ? (
          <View
            style={[
              styles.loading,
              { width: widthDefault?.width, height: widthDefault?.height },
            ]}
          >
            <ActivityIndicator
              size={sizeLoading[size]}
              color={color ? Colors[color] : stylesText[variant].color}
            />
          </View>
        ) : (
          <RenderChildren
            variant={variant}
            size={size}
            iconLeft={iconLeft}
            iconRight={iconRight}
            colorIconVariante={colorIconVariante}
            onLayout={({ nativeEvent }) => setWidthDefault(nativeEvent.layout)}
            color={color}
          >
            {children}
          </RenderChildren>
        )}
      </TouchableOpacity>
    </>
  );
};
