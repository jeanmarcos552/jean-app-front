import { theme } from "@/theme";
import React, { useMemo } from "react";
import type { SectionListProps } from "react-native";
import { Platform, RefreshControl, SectionList, StyleSheet } from "react-native";
import { Separator } from "./Separator";

export type RootSectionListProps<T> = SectionListProps<T> & {
  isRefetching?: boolean;
  refetch?: () => void;
};

const noop = () => {};

type SectionListComponent = <T>(
  props: RootSectionListProps<T> & { ref?: React.Ref<SectionList<T>> },
) => React.ReactElement | null;

const RootSectionListInner = <T,>(
  props: RootSectionListProps<T>,
  ref: React.Ref<SectionList<T>>,
) => {
  const {
    contentContainerStyle,
    initialNumToRender = 5,
    showsVerticalScrollIndicator = false,
    isRefetching = false,
    refetch = noop,
    ...rest
  } = props;

  const mergedContentStyle = useMemo(
    () => [styles.contentContainer, contentContainerStyle],
    [contentContainerStyle],
  );

  const refreshControl = useMemo(
    () => (
      <RefreshControl
        tintColor={theme.colors.primary}
        refreshing={isRefetching}
        onRefresh={refetch}
      />
    ),
    [isRefetching, refetch],
  );

  const ListFooterComponent = useMemo(() => {
    return <Separator size={100} />;
  }, []);

  return (
    <SectionList
      ref={ref}
      contentContainerStyle={mergedContentStyle}
      keyExtractor={(_, index) => index.toString()}
      stickySectionHeadersEnabled
      keyboardShouldPersistTaps="handled"
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={showsVerticalScrollIndicator}
      initialNumToRender={initialNumToRender}
      maxToRenderPerBatch={10}
      windowSize={5}
      removeClippedSubviews={Platform.OS !== "ios"}
      refreshControl={refreshControl}
      ListFooterComponent={ListFooterComponent}
      {...rest}
    />
  );
};

export const RootSectionList = React.forwardRef(
  RootSectionListInner,
) as SectionListComponent;

const styles = StyleSheet.create({
  contentContainer: {
    flexGrow: 1,
    gap: 6,
  },
});
