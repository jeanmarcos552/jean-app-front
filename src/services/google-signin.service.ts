import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";

export function configureGoogleSignIn() {
  GoogleSignin.configure({
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    scopes: process.env.EXPO_PUBLIC_GOOGLE_SCOPES?.split(",") || [],
  });
}

export async function signInWithGoogleProvider() {
  await GoogleSignin.hasPlayServices();
  const response = await GoogleSignin.signIn();

  if (!response.data?.idToken) {
    throw new Error("Falha ao obter token do Google.");
  }

  return {
    idToken: response.data.idToken,
    user: response.data.user,
  };
}

export async function signOutFromGoogle() {
  try {
    await GoogleSignin.signOut();
  } catch {
    // silencia erros
  }
}
