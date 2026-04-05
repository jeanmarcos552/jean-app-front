import { Background, Colors } from "@/constants/theme";
import { AntDesign } from "@expo/vector-icons";
import { Modal, ModalProps, Pressable, StyleSheet } from "react-native";
import {
  initialWindowMetrics,
  SafeAreaProvider,
  SafeAreaView,
} from "react-native-safe-area-context";
import Text from "../Text";
import View from "../View";

type LayoutModalProps = ModalProps & {
  visible: boolean;
  closeModal: () => void;
  children: React.ReactNode;
  title?: string;
};

export function LayoutModal({
  visible,
  closeModal,
  children,
  title,
  presentationStyle = "fullScreen",
  ...rest
}: LayoutModalProps) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      presentationStyle={presentationStyle}
      onRequestClose={closeModal}
      {...rest}
    >
      <SafeAreaProvider initialMetrics={initialWindowMetrics}>
        <SafeAreaView style={styles.modalArea} edges={["top"]}>
          <View style={styles.modalHeader}>
            <Text type="subtitulo">{title || "Selecionar item"}</Text>
            <Pressable onPress={closeModal} style={styles.closeButton}>
              <AntDesign name="close" size={18} color={Colors.white} />
            </Pressable>
          </View>
          <View style={styles.modalContent}>{children}</View>
        </SafeAreaView>
      </SafeAreaProvider>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalArea: {
    flex: 1,
    backgroundColor: Background.black,
    paddingHorizontal: 12,
  },
  modalHeader: {
    marginBottom: 12,
    marginTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  closeButton: {
    padding: 8,
  },
  modalContent: {
    flex: 1,
    gap: 10,
  },
});
