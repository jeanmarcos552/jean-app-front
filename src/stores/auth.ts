import { createMMKV } from "react-native-mmkv";
import { create } from "zustand";
import { User } from "@/types/user";

export const storage = createMMKV();

type AuthState = {
  user: User | undefined;
  api_token: string;
  abilities: number[];
  isBootstrapping: boolean;
  isLoading: boolean;
  setLoading: (value: boolean) => void;
  setSession: (user: User, token: string, abilities: number[]) => void;
  clearSession: () => void;
  initialize: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: undefined,
  api_token: "",
  abilities: [],
  isBootstrapping: true,
  isLoading: true,

  initialize: () => {
    const token = storage.getString("api_token");
    const userString = storage.getString("user");
    const abilitiesString = storage.getString("abilities");
    const user = userString ? JSON.parse(userString) : undefined;
    const abilities = abilitiesString ? JSON.parse(abilitiesString) : [];
    set({ user, api_token: token ?? "", abilities, isBootstrapping: false, isLoading: false });
  },

  setLoading: (value) => {
    set({ isLoading: value });
  },

  setSession: (user, token, abilities) => {
    storage.set("api_token", token);
    storage.set("user", JSON.stringify(user));
    storage.set("abilities", JSON.stringify(abilities));
    set({ user, api_token: token, abilities });
  },

  clearSession: () => {
    storage.remove("api_token");
    storage.remove("user");
    storage.remove("abilities");
    set({ user: undefined, api_token: "", abilities: [] });
  },
}));
