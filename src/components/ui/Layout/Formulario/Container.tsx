import { StyleSheet, ViewProps } from "react-native";
import View from "../../View";

type FormularioContainerProps = {
  children: React.ReactNode;
  styles?: ViewProps["style"];
};
export const FormularioContainer = ({
  children,
  styles,
}: FormularioContainerProps) => {
  return (
    <View style={StyleSheet.flatten([stylesComponent.containerForm, styles])}>
      {children}
    </View>
  );
};

const stylesComponent = StyleSheet.create({
  containerForm: {
    marginHorizontal: 10,
    gap: 12,
  },
});
