import { Colors } from "@/constants/theme";
import { theme } from "@/theme";
import { Platform, StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  button: {
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 8,
    borderRadius: 22,
    gap: 8,
  },
  iconContainer: {
    marginHorizontal: 4,
  },
  loading: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
});

export const stylesBackground = StyleSheet.create({
  default: {
    backgroundColor: theme.colors.secundary,
    borderColor: theme.border.primary,
    borderWidth: 0.5,
    borderRadius: 22,
    shadowColor: theme.shadows.primary,
    shadowOffset: Platform.select({
      ios: { width: 3, height: 1 },
      android: { width: 6, height: 6 },
    }),
    shadowOpacity: 1,
    shadowRadius: 999,
    elevation: Platform.OS === "ios" ? 1 : 10,
  },
  outline: {
    borderWidth: 1,
    borderColor: theme.colors.secundary,
    backgroundColor: "transparent",
  },
  success: {
    borderColor: theme.border.success,
    borderWidth: 0.5,
    backgroundColor: theme.colors.success,
    borderRadius: 22,
    shadowColor: theme.shadows.success,
    shadowOffset: Platform.select({
      ios: { width: 3, height: 1 },
      android: { width: 6, height: 6 },
    }),
    shadowOpacity: 1,
    shadowRadius: 999,
    elevation: Platform.OS === "ios" ? 1 : 10,
  },
  link: {
    backgroundColor: "transparent",
    shadowColor: "transparent",
    shadowOffset: { width: 0, height: 0 },
  },
  dark: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.border.gray,
    borderWidth: 0.5,
  }
});

export const stylesText = StyleSheet.create({
  default: {
    color: "#fff",
    fontWeight: "700",
    fontFamily: theme.fonts.titulo,
  },
  outline: {
    color: "#fff",
    fontWeight: "700",
    fontFamily: theme.fonts.titulo,
  },
  success: {
    color: "#fff",
    fontFamily: theme.fonts.titulo,
    fontWeight: "700",
  },
  link: {
    color: Colors.secundary,
    fontFamily: theme.fonts.titulo,
    fontWeight: "700",
    textDecorationLine: "underline",
  },
  dark: {
    color: "#fff",
    fontFamily: theme.fonts.titulo,
    fontWeight: "700",
  }
});

export const sizeStyles = StyleSheet.create({
  small: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  medium: {
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 45,
  },
  large: {
    paddingVertical: 12,
    paddingHorizontal: 36,
    borderRadius: 5,
  },
  link: {
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
});

export const sizeTextStyles = StyleSheet.create({
  small: {
    fontSize: 12.5,
    textTransform: "capitalize",
    fontWeight: "400",
  },
  medium: {
    fontSize: 14,
  },
  large: {
    fontSize: 14.5,
  },
  link: {
    fontSize: 14,
  },
});
