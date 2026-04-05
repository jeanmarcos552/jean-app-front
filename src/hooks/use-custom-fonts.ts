import { useFonts } from "expo-font";

export function useCustomFonts() {
  const [loaded, error] = useFonts({
    "Montserrat-Medium": require("../../assets/fonts/Montserrat-Medium.ttf"),
    "Montserrat-SemiBold": require("../../assets/fonts/Montserrat-SemiBold.ttf"),
  });

  return { loaded, error };
}
