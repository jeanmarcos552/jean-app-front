import { Colors } from "@/constants/theme";
import React from "react";
import { ActivityIndicator, StyleSheet } from "react-native";
import View from "../View";

export function CardLoading() {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size={22} color={Colors.white} />
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
    flex: 0.3,
  },
});
