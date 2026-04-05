import { theme } from "@/theme";
import React, { useMemo } from "react";
import type { FlatListProps } from "react-native";
import { FlatList, Platform, RefreshControl, StyleSheet } from "react-native";
import { Separator } from "./Separator";

export type RootFlatListProps<T> = FlatListProps<T> & {
  isRefetching?: boolean;
  refetch?: () => void;
};

const noop = () => {};

type FlatListComponent = <T>(
  props: RootFlatListProps<T> & { ref?: React.Ref<FlatList<T>> },
) => React.ReactElement | null;

const RootFlatListInner = <T,>(
  props: RootFlatListProps<T>,
  ref: React.Ref<FlatList<T>>,
) => {
  const {
    contentContainerStyle,
    stickyHeaderIndices = [0],
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
    <FlatList
      ref={ref}
      contentContainerStyle={mergedContentStyle}
      showsVerticalScrollIndicator={showsVerticalScrollIndicator}
      stickyHeaderHiddenOnScroll
      stickyHeaderIndices={stickyHeaderIndices}
      initialNumToRender={initialNumToRender}
      maxToRenderPerBatch={10}
      windowSize={5}
      removeClippedSubviews={Platform.OS !== "ios"}
      ListFooterComponent={ListFooterComponent}
      refreshControl={refreshControl}
      {...rest}
    />
  );
};

export const RootFlatList = React.forwardRef(
  RootFlatListInner,
) as FlatListComponent;

const styles = StyleSheet.create({
  separator: {
    height: 10,
  },
  contentContainer: {
    gap: 6,
  },
});
