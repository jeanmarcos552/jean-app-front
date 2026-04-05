import React, { useCallback } from "react";
import {
  View as RNView,
  ScrollView,
  FlatList,
  SectionList,
  ActivityIndicator,
  ImageBackground,
  ImageSourcePropType,
  KeyboardAvoidingView,
  Platform,
  Modal as RNModal,
  Pressable,
  RefreshControl,
  StyleSheet,
  ViewProps,
  FlatListProps,
  SectionListProps,
} from "react-native";
import { useRouter } from "expo-router";
import { theme } from "@theme";
import { Text } from "../Text";
import { Button } from "../Buttons";
import { SafeAreaView } from "react-native-safe-area-context";

// Layout.Root
function Root({
  children,
  source,
  style,
}: {
  children: React.ReactNode;
  source?: ImageSourcePropType;
  style?: any;
}) {
  const content = (
    <SafeAreaView style={[styles.root, style]}>{children}</SafeAreaView>
  );

  if (source) {
    return (
      <ImageBackground source={source} style={styles.root} resizeMode="cover">
        {content}
      </ImageBackground>
    );
  }

  return content;
}

// Layout.Header
function Header({
  title,
  subtitle,
  rightContent,
  showBack = true,
}: {
  title?: string;
  subtitle?: string;
  rightContent?: React.ReactNode;
  showBack?: boolean;
}) {
  const router = useRouter();

  return (
    <RNView style={styles.header}>
      <RNView style={styles.headerLeft}>
        {showBack && (
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Text type="paragrafo" color="white">
              {"←"}
            </Text>
          </Pressable>
        )}
        <RNView>
          {title && <Text type="titulo">{title}</Text>}
          {subtitle && <Text type="subtitulo">{subtitle}</Text>}
        </RNView>
      </RNView>
      {rightContent && <RNView>{rightContent}</RNView>}
    </RNView>
  );
}

// Layout.Footer
function Footer({ children, style }: ViewProps) {
  return <RNView style={[styles.footer, style]}>{children}</RNView>;
}

// Layout.Container
function Container({ children, style, ...rest }: ViewProps) {
  return (
    <RNView style={[styles.container, style]} {...rest}>
      {children}
    </RNView>
  );
}

// Layout.List
function List<T>({
  refreshing = false,
  onRefresh,
  ...rest
}: FlatListProps<T> & { refreshing?: boolean; onRefresh?: () => void }) {
  return (
    <FlatList
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.secundary}
          />
        ) : undefined
      }
      {...rest}
    />
  );
}

// Layout.SectionListWrapper
function SectionListWrapper<T>({
  refreshing = false,
  onRefresh,
  ...rest
}: SectionListProps<T> & { refreshing?: boolean; onRefresh?: () => void }) {
  return (
    <SectionList
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
      stickySectionHeadersEnabled={false}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.secundary}
          />
        ) : undefined
      }
      {...rest}
    />
  );
}

// Layout.Formulario
function Formulario<T>({
  children,
  ...rest
}: SectionListProps<T> & { children?: React.ReactNode }) {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.flex}
    >
      <SectionList
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        stickySectionHeadersEnabled={false}
        keyboardShouldPersistTaps="handled"
        {...rest}
      />
      {children}
    </KeyboardAvoidingView>
  );
}

// Layout.Loading
function Loading() {
  return (
    <RNView style={styles.centered}>
      <ActivityIndicator size="large" color={theme.colors.secundary} />
    </RNView>
  );
}

// Layout.Skeleton
function Skeleton() {
  return (
    <RNView style={styles.skeletonContainer}>
      {[1, 2, 3].map((i) => (
        <RNView key={i} style={styles.skeletonItem}>
          <RNView style={styles.skeletonLine} />
          <RNView style={[styles.skeletonLine, { width: "60%" }]} />
        </RNView>
      ))}
    </RNView>
  );
}

// Layout.Empty
function Empty({ message = "Nenhum item encontrado" }: { message?: string }) {
  return (
    <RNView style={styles.centered}>
      <Text type="subtitulo" color="gray">
        {message}
      </Text>
    </RNView>
  );
}

// Layout.Error
function Error({ message = "Ocorreu um erro", onRetry }: { message?: string; onRetry?: () => void }) {
  return (
    <RNView style={styles.centered}>
      <Text type="subtitulo" color="danger">
        {message}
      </Text>
      {onRetry && (
        <Button variant="outline" size="small" onPress={onRetry}>
          Tentar novamente
        </Button>
      )}
    </RNView>
  );
}

// Layout.Modal
function LayoutModal({
  visible,
  onClose,
  children,
}: {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <RNModal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
          {children}
        </Pressable>
      </Pressable>
    </RNModal>
  );
}

// Layout.Scroll
function Scroll({ children, style }: { children: React.ReactNode; style?: any }) {
  return (
    <ScrollView
      contentContainerStyle={[styles.listContent, style]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {children}
    </ScrollView>
  );
}

// Layout.Separator
function Separator({ size = 16 }: { size?: number }) {
  return <RNView style={{ height: size }} />;
}

// Layout.Title
function Title({ children, style }: { children: React.ReactNode; style?: any }) {
  return (
    <RNView style={[styles.sectionTitle, style]}>
      <Text type="titulo">{children}</Text>
    </RNView>
  );
}

// Layout.Button
function LayoutButton(props: React.ComponentProps<typeof Button>) {
  return <Button {...props} />;
}

export const Layout = {
  Root,
  Header,
  Footer,
  Container,
  List,
  SectionList: SectionListWrapper,
  Formulario,
  Loading,
  Skeleton,
  Empty,
  Error,
  Modal: LayoutModal,
  Scroll,
  Separator,
  Title,
  Button: LayoutButton,
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.background.black,
  },
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.background.secundary,
    alignItems: "center",
    justifyContent: "center",
  },
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: theme.border.black,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    gap: 12,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    gap: 12,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    padding: 24,
  },
  skeletonContainer: {
    padding: 16,
    gap: 16,
  },
  skeletonItem: {
    backgroundColor: theme.background.black,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.border.black,
    padding: 16,
    gap: 10,
  },
  skeletonLine: {
    height: 14,
    backgroundColor: theme.background.secundary,
    borderRadius: 6,
    width: "80%",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  modalContent: {
    backgroundColor: theme.background.black,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.border.black,
    padding: 24,
    width: "100%",
    maxWidth: 400,
    gap: 16,
  },
  sectionTitle: {
    paddingVertical: 4,
  },
});
