import { z } from "zod";
import { api } from "@/lib/api";

const UserSchema = z.object({
  id: z.union([z.number(), z.string()]).transform(String),
  name: z.string(),
  email: z.string(),
  cpf: z.string().optional().default(""),
  pix_key: z.string().optional().default(""),
  created_at: z.string().optional().default(""),
  updated_at: z.string().optional().default(""),
});

const LoginResponseSchema = z.object({
  success: z.literal(true),
  data: z.object({
    user: UserSchema,
    token: z.string(),
  }),
  message: z.string().nullable(),
});

const GoogleAuthResponseSchema = z.object({
  success: z.literal(true),
  data: z.union([
    z.object({
      user: UserSchema,
      token: z.string(),
    }),
    z.object({
      needs_registration: z.literal(true),
      name: z.string(),
      email: z.string(),
    }),
  ]),
  message: z.string().nullable(),
});

export type LoginResponse = z.infer<typeof LoginResponseSchema>;
export type GoogleAuthResponse = z.infer<typeof GoogleAuthResponseSchema>;

function parseLoginResponse(data: unknown) {
  try {
    return LoginResponseSchema.parse(data);
  } catch (error) {
    console.error("Erro ao validar resposta de login:", error);
    throw new Error("Resposta do servidor em formato invalido.");
  }
}

function parseGoogleAuthResponse(data: unknown) {
  try {
    return GoogleAuthResponseSchema.parse(data);
  } catch (error) {
    console.error("Erro ao validar resposta Google auth:", error);
    throw new Error("Resposta do servidor em formato invalido.");
  }
}

export async function signIn(email: string, password: string) {
  const { data } = await api.post("/auth/login", { email, password });
  return parseLoginResponse(data);
}

export async function signUp(payload: {
  name: string;
  email: string;
  cpf: string;
  password: string;
  pix_key: string;
}) {
  const { data } = await api.post("/auth/register", payload);
  return parseLoginResponse(data);
}

export async function signInWithGoogle(idToken: string) {
  const { data } = await api.post("/auth/google", { token: idToken });
  return parseGoogleAuthResponse(data);
}
