import { HeaderBackButton } from "@react-navigation/elements";
import { useNavigation } from "@react-navigation/native";
import { theme } from "@theme";
import React, { useMemo } from "react";
import {
  Platform,
  RefreshControl,
  SectionList,
  SectionListProps,
  StyleSheet,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Text from "../Text";
import View from "../View";

export type RootSectionListProps = SectionListProps<any> & {
  children?: React.ReactNode;
  StickyHeaderComponent?: React.ReactNode;
  refetch?: () => void;
  loading?: boolean;
  ListFooterComponent?: React.ReactNode;
};

export function Header({ title, children }: any) {
  const navigation = useNavigation();

  return (
    <View style={stylesHeader.titulo}>
      <View variant="row">
        <HeaderBackButton
          onPress={() => navigation.goBack()}
          tintColor={theme.colors.white}
        />
        <Text type="titulo">{title}</Text>
      </View>
      <>
        {children && (
          <View style={stylesHeader.botoes} variant="row">
            {children}
          </View>
        )}
      </>
    </View>
  );
}

const stylesHeader = StyleSheet.create({
  titulo: {
    marginVertical: 22,
    gap: 18,
  },
  botoes: {
    justifyContent: "center",
    gap: 18,
  },
});

export const RootSectionList = ({
  children,
  StickyHeaderComponent,
  refetch,
  loading = false,
  ListFooterComponent: ListFooterComponentApp,
  ...rest
}: RootSectionListProps) => {
  const { bottom } = useSafeAreaInsets();

  const refreshControl = useMemo(
    () => (
      <RefreshControl
        tintColor={theme.colors.primary}
        refreshing={loading}
        onRefresh={refetch}
      />
    ),
    [loading, refetch],
  );

  const listFooter = useMemo(
    () => (
      <View style={{ marginBottom: bottom + 100 }}>
        {ListFooterComponentApp && ListFooterComponentApp}
      </View>
    ),
    [bottom, ListFooterComponentApp],
  );

  return (
    <SectionList
      contentContainerStyle={styles.contentContainer}
      keyExtractor={(_, index) => index.toString()}
      stickySectionHeadersEnabled
      keyboardShouldPersistTaps="handled"
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      initialNumToRender={5}
      maxToRenderPerBatch={10}
      windowSize={5}
      removeClippedSubviews={Platform.OS !== "ios"}
      refreshControl={refreshControl}
      ListFooterComponent={listFooter}
      {...rest}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    gap: 8,
  },
});
