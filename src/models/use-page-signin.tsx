import { Alert } from "react-native";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/contexts/authContexts";
import { useAuthStore } from "@/stores/auth";
import { signIn } from "@/services/auth.service";
import { signInWithGoogle } from "@/services/auth.service";
import { signInWithGoogleProvider } from "@/services/google-signin.service";
import { getApiErrorMessage } from "@/lib/api";

const schema = z.object({
  login: z.string().min(1, "Campo obrigatorio"),
  senha: z.string().min(3, "Minimo 3 caracteres"),
});

type FormData = z.infer<typeof schema>;

export function usePageSignIn() {
  const { login } = useAuth();
  const { setLoading, isLoading } = useAuthStore();

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { login: "", senha: "" },
  });

  const handleLogin = form.handleSubmit(async (data) => {
    try {
      setLoading(true);
      const response = await signIn(data.login, data.senha);
      const { user, token } = response.data;
      login(user as any, token, []);
    } catch (error: any) {
      Alert.alert("Erro", getApiErrorMessage(error));
    } finally {
      setLoading(false);
    }
  });

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      const googleResponse = await signInWithGoogleProvider();
      const response = await signInWithGoogle(googleResponse.idToken);

      if ("needs_registration" in response.data) {
        Alert.alert(
          "Cadastro necessario",
          "Voce precisa completar seu cadastro para continuar."
        );
        return;
      }

      const { user, token } = response.data;
      login(user as any, token, []);
    } catch (error: any) {
      Alert.alert("Erro", getApiErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    isLoading,
    handleLogin,
    handleGoogleLogin,
  };
}
