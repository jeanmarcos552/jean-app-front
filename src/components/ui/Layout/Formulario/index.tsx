import { HeaderBackButton } from "@react-navigation/elements";
import { useNavigation } from "@react-navigation/native";
import { theme } from "@theme";
import React, { ElementType } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  SectionList,
  SectionListProps,
  StyleSheet,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Text from "../../Text";
import View from "../../View";
import { FormularioContainer } from "./Container";

export type FormularioProps = SectionListProps<ElementType<any, any>> & {
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

export const Formulario = ({
  children,
  StickyHeaderComponent,
  refetch,
  loading = false,
  ListFooterComponent: ListFooterComponentApp,
  ...rest
}: FormularioProps) => {
  const { bottom } = useSafeAreaInsets();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 12}
      style={[styles.container]}
    >
      <SectionList
        contentContainerStyle={styles.contentContainer}
        keyExtractor={(_, index) => index.toString()}
        stickySectionHeadersEnabled
        keyboardShouldPersistTaps="handled"
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refetch} />
        }
        ListFooterComponent={
          <View style={{ marginBottom: bottom + 16 }}>
            {ListFooterComponentApp && ListFooterComponentApp}
          </View>
        }
        renderItem={({ item }) => (
          <View style={{ gap: 16, justifyContent: "space-between" }}>
            {item}
          </View>
        )}
        {...rest}
      />
    </KeyboardAvoidingView>
  );
};

export const FormularioApp = {
  Container: FormularioContainer,
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    // paddingBottom: 22,
    gap: 16,
  },
});
