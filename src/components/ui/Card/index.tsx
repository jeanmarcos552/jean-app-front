import React, { useState } from "react";
import {
  View as RNView,
  Pressable,
  Image,
  ImageSourcePropType,
  StyleSheet,
  ViewProps,
  ImageStyle,
} from "react-native";
import { theme } from "@theme";
import { Text } from "../Text";

// Card.Root
function Root({ children, style, ...rest }: ViewProps) {
  return (
    <RNView style={[styles.root, style]} {...rest}>
      {children}
    </RNView>
  );
}

// Card.Header
function Header({ children, style, ...rest }: ViewProps) {
  return (
    <RNView style={[styles.header, style]} {...rest}>
      {children}
    </RNView>
  );
}

// Card.Content
function Content({ children, style, ...rest }: ViewProps) {
  return (
    <RNView style={[styles.content, style]} {...rest}>
      {children}
    </RNView>
  );
}

// Card.Title
function Title({ children, style }: { children: React.ReactNode; style?: any }) {
  return (
    <Text type="titulo" style={style}>
      {children}
    </Text>
  );
}

// Card.Icon
function Icon({ children, style, ...rest }: ViewProps) {
  return (
    <RNView style={[styles.icon, style]} {...rest}>
      {children}
    </RNView>
  );
}

// Card.Image
function CardImage({ source, style }: { source: ImageSourcePropType; style?: ImageStyle }) {
  return <Image source={source} style={[styles.image, style]} resizeMode="cover" />;
}

// Card.Label
function Label({ children, style }: { children: React.ReactNode; style?: any }) {
  return (
    <Text type="small" color="gray" style={style}>
      {children}
    </Text>
  );
}

// Card.Badge
function Badge({
  children,
  color = "secundary",
}: {
  children: React.ReactNode;
  color?: keyof typeof theme.background;
}) {
  return (
    <RNView style={[styles.badge, { backgroundColor: theme.background[color] }]}>
      <Text type="small" style={{ fontSize: 10 }}>
        {children}
      </Text>
    </RNView>
  );
}

// Card.Press
function Press({
  children,
  onPress,
  style,
  ...rest
}: ViewProps & { onPress?: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.root, pressed && styles.pressed, style]}
      {...rest}
    >
      {children}
    </Pressable>
  );
}

// Card.Footer
function Footer({ children, style, ...rest }: ViewProps) {
  return (
    <RNView style={[styles.footer, style]} {...rest}>
      {children}
    </RNView>
  );
}

// Card.Collapsible
function Collapsible({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <RNView>
      <Pressable onPress={() => setExpanded(!expanded)} style={styles.collapsibleHeader}>
        <Text type="subtitulo">{title}</Text>
        <Text type="small" color="gray">
          {expanded ? "▲" : "▼"}
        </Text>
      </Pressable>
      {expanded && <RNView style={styles.content}>{children}</RNView>}
    </RNView>
  );
}

// Card.Empty
function Empty({ message = "Nenhum item encontrado" }: { message?: string }) {
  return (
    <RNView style={styles.empty}>
      <Text type="subtitulo" color="gray">
        {message}
      </Text>
    </RNView>
  );
}

// Card.Loading
function Loading() {
  return (
    <RNView style={[styles.root, styles.skeleton]}>
      <RNView style={styles.skeletonLine} />
      <RNView style={[styles.skeletonLine, { width: "60%" }]} />
    </RNView>
  );
}

export const Card = {
  Root,
  Header,
  Content,
  Title,
  Icon,
  Image: CardImage,
  Label,
  Badge,
  Press,
  Footer,
  Collapsible,
  Empty,
  Loading,
};

const styles = StyleSheet.create({
  root: {
    backgroundColor: theme.background.black,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.border.black,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 16,
  },
  content: {
    padding: 16,
    paddingTop: 0,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.background.secundary,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: "100%",
    height: 160,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 8,
    padding: 16,
    paddingTop: 0,
  },
  pressed: {
    opacity: 0.85,
  },
  collapsibleHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  empty: {
    padding: 24,
    alignItems: "center",
  },
  skeleton: {
    padding: 16,
    gap: 12,
  },
  skeletonLine: {
    height: 14,
    backgroundColor: theme.background.secundary,
    borderRadius: 6,
    width: "80%",
  },
});
