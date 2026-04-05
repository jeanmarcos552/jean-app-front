# Arquitetura Base - React Native com Expo

Documento de referencia para recriar um projeto novo seguindo os mesmos padroes de arquitetura, tema, autenticacao e organizacao de pastas.

---

## Stack Tecnologica

| Camada | Tecnologia | Versao |
|---|---|---|
| Framework | React Native + Expo (managed) | RN 0.81+ / Expo 54+ |
| Linguagem | TypeScript (strict) | 5.9+ |
| Navegacao | Expo Router (file-based) | 6+ |
| Estado Global | Zustand + MMKV | Zustand 5+ |
| Data Fetching | React Query (TanStack Query) | 5+ |
| HTTP | Axios (com interceptors) | 1.13+ |
| Validacao | Zod | 4+ |
| Formularios | react-hook-form + @hookform/resolvers | 7+ |
| Auth | Google Sign-In + Apple Auth + Email/Senha | - |
| Fontes | Montserrat (via expo-font) | - |
| Storage Local | react-native-mmkv | 4+ |
| Animacoes | react-native-reanimated | 4+ |

---

## Estrutura de Pastas

```
src/
├── app/                        # Expo Router (file-based routing)
│   ├── _layout.tsx             # Root layout (providers)
│   ├── (auth)/                 # Grupo de autenticacao
│   │   ├── signin.tsx          # Tela de login (Google/Apple/Email)
│   │   ├── email-senha.tsx     # Login com email e senha
│   │   └── recuperar-senha.tsx # Recuperar senha
│   ├── (tabs)/                 # Bottom tab navigation
│   │   ├── _layout.tsx         # Configuracao das tabs
│   │   ├── index.tsx           # Home
│   │   └── perfil.tsx          # Perfil
│   └── [feature]/              # Telas de features (stack screens)
│
├── components/
│   ├── ui/                     # Componentes base reutilizaveis
│   │   ├── Buttons/            # Variantes de botao
│   │   ├── Card/               # Sistema de Card composicional
│   │   ├── Inputs/             # Inputs de formulario (Text, Date, Select, Radio, Switch)
│   │   ├── Layout/             # Layouts reutilizaveis (Root, Header, Footer, Container, etc)
│   │   ├── Text.tsx            # Componente de texto com variantes
│   │   ├── View.tsx            # View com variantes (row, column, center)
│   │   └── Flex.tsx            # Atalho para flex layouts
│   └── [dominio]/              # Componentes especificos de dominio
│
├── features/                   # Modulos de feature
│   └── [feature]/              # Componentes e logica especifica da feature
│
├── services/                   # Camada de servicos (chamadas API)
│   ├── auth.service.ts         # Login, signup
│   ├── google-signin.service.ts # Google auth
│   └── [dominio].service.ts    # Servicos por dominio
│
├── queries/                    # React Query hooks
│   └── use[Dominio].ts         # Hooks de query por dominio
│
├── stores/                     # Zustand stores
│   ├── auth.ts                 # Estado de autenticacao + MMKV
│   └── [dominio].ts            # Stores por dominio
│
├── contexts/                   # React Contexts
│   └── authContexts.tsx        # Provider de autenticacao
│
├── lib/                        # Instancias de API (Axios)
│   ├── api.ts                  # API principal com interceptors
│   └── [nome]-api.ts           # APIs externas adicionais
│
├── hooks/                      # Hooks genericos reutilizaveis
│   ├── useAuth.tsx             # Hook do contexto de auth
│   ├── use-custom-fonts.ts     # Carregamento de fontes
│   └── useDebounce.ts          # Debounce
│
├── models/                     # Hooks de logica de pagina
│   └── use-page-[nome].tsx     # Logica isolada por tela (form, handlers)
│
├── helper/                     # Utilitarios
│   ├── Mask.ts                 # Mascaras de input (CPF, CNPJ, tel, CEP, moeda)
│   ├── validacoes.ts           # Validacoes
│   └── date-format.ts          # Formatacao de datas
│
├── theme/                      # Design tokens
│   └── index.ts                # Cores, fontes, espacamentos
│
├── constants/                  # Constantes globais
│   ├── theme.ts                # Re-export do tema + dimensoes de tela
│   └── sizes.ts                # Tamanhos
│
└── types/                      # Tipos TypeScript
    └── [dominio].ts            # Tipos por dominio
```

---

## Sistema de Tema

### Estrutura de tokens

```typescript
// src/theme/index.ts
export const theme = {
  colors: {
    primary: "#111111",
    secundary: "#bf1e86",       // cor de destaque
    warning: "#f59e0b",
    info: "#1356b4",
    success: "rgb(77, 207, 166)",
    danger: "#da5050",
    gray: "#a1a1a1",
    black: "rgba(0, 0, 0, 0.7)",
    white: "#d6d6d6",
  },
  background: {
    primary: "#bf1e8725",       // versao transparente da cor primaria
    secundary: "#7272723b",
    warning: "#fbe4b433",
    info: "#C3DEFF36",
    success: "rgba(5, 150, 104, 0.24)",
    danger: "#8f050521",
    gray: "rgba(228, 228, 228, 0.12)",
    black: "#161616",           // fundo principal (dark mode)
    white: "#dddddd",
  },
  border: {
    primary: "#d273b147",
    secundary: "#9c9c9c3b",
    warning: "rgba(250, 208, 153, 0.16)",
    info: "rgba(9, 43, 88, 0.14)",
    success: "rgba(5, 150, 104, 0.16)",
    danger: "rgba(255, 194, 194, 0.24)",
    gray: "rgba(218, 218, 218, 0.2)",
    black: "#303030",
    white: "#ffffff",
  },
  shadows: {
    primary: "#ef4444ff",
    secundary: "#0001F7ff",
    warning: "#F4AD49",
    info: "#0f6df0",
    success: "#519765FF",
    danger: "#D85A5AFF",
    gray: "#BDC3CFFF",
    black: "#fff",
    white: "#303030",
  },
  fonts: {
    body: "Montserrat-Medium",
    subtitulo: "Montserrat-Medium",
    titulo: "Montserrat-SemiBold",
  },
};
```

### Re-export no constants

```typescript
// src/constants/theme.ts
import { Dimensions } from "react-native";
import { theme } from "@theme";

export const Colors = theme.colors;
export const Background = theme.background;
export const Border = theme.border;
export const Fonts = theme.fonts;
export const WIDTH = Dimensions.get("window").width;
export const HEIGHT = Dimensions.get("window").height;
```

**Padrao**: Cada token de cor tem 4 variantes: `colors` (texto/icone), `background` (fundo com transparencia), `border` (borda com transparencia), `shadows` (sombra). O tema e dark-first (fundo `#161616`).

---

## Navegacao

### Root Layout com Providers

```typescript
// src/app/_layout.tsx
export default function Layout() {
  const { loaded } = useCustomFonts();

  useEffect(() => {
    configureGoogleSignIn();
  }, []);

  return (
    <GestureHandlerRootView>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="(auth)/signin" />
          </Stack>
        </AuthProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
```

### Tabs com protecao de rota

```typescript
// src/app/(tabs)/_layout.tsx
export default function TabLayout() {
  const { user } = useAuth();
  if (!user) return <Redirect href="/(auth)/signin" />;

  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: "Home", tabBarIcon: ... }} />
      <Tabs.Screen name="perfil" options={{ title: "Perfil", tabBarIcon: ... }} />
    </Tabs>
  );
}
```

**Padrao**: Redirecionamento para login se nao autenticado diretamente no layout das tabs.

---

## Autenticacao

### Fluxo Google Sign-In

```
1. configureGoogleSignIn() - chamado no _layout.tsx root
2. signInWithGoogleProvider() - retorna { idToken, accessToken, user }
3. signInWithGoogle(payload) - envia idToken para API backend
4. login(user, token, abilities) - salva sessao no Zustand + MMKV
5. router.replace("/(tabs)") - redireciona para app
```

### Zustand Store de Auth (com MMKV)

```typescript
// src/stores/auth.ts
import { createMMKV } from "react-native-mmkv";
import { create } from "zustand";

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
    const user = userString ? JSON.parse(userString) : undefined;
    set({ user, api_token: token ?? "", isBootstrapping: false, isLoading: false });
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
```

### Auth Context (Provider)

```typescript
// src/contexts/authContexts.tsx
export const AuthProvider = ({ children }) => {
  const { user, api_token, abilities, isLoading, setSession, clearSession, initialize } = useAuthStore();
  const queryClient = useQueryClient();
  const router = useRouter();

  useEffect(() => { initialize(); }, []);

  const login = (user, token, abilities) => {
    setSession(user, token, abilities);
    router.replace("/(tabs)");
  };

  const logout = async () => {
    await api.post("/logout").finally(() => {
      clearSession();
      queryClient.clear();
      signOutFromGoogle().catch(() => {});
    });
  };

  return (
    <AuthContext.Provider value={{ user, api_token, abilities, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
```

---

## Camada de Dados (Service + Query + Zod)

### Padrao: Service

```typescript
// src/services/[dominio].service.ts
import { z } from "zod";
import { api } from "@/lib/api";

// 1. Schema Zod para validar resposta
const ItemSchema = z.object({
  id: z.union([z.number(), z.string()]).transform(Number),
  nome: z.string(),
  // ... campos
});

const ListResponseSchema = z.array(ItemSchema);
export type Item = z.infer<typeof ItemSchema>;

// 2. Parser
function parseResponse(data: unknown): Item[] {
  try {
    return ListResponseSchema.parse(data);
  } catch (error) {
    console.error("Erro ao validar resposta:", error);
    throw new Error("Resposta do servidor em formato invalido.");
  }
}

// 3. Funcao de fetch
export async function fetchItems() {
  const { data } = await api.get("/items");
  return parseResponse(data);
}
```

### Padrao: Query Hook

```typescript
// src/queries/use[Dominio].ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchItems } from "@/services/[dominio].service";

export function useItems() {
  return useQuery({
    queryKey: ["items"],
    queryFn: fetchItems,
  });
}

export function useCreateItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
    },
  });
}
```

### Configuracao do Axios

```typescript
// src/lib/api.ts
export const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
});

// Interceptor: adiciona token
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().api_token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Interceptor: trata 401
api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err.response?.status === 401) {
      useAuthStore.getState().clearSession();
      router.replace("/(auth)/signin");
    }
    return Promise.reject(err);
  }
);
```

---

## Componentes UI

### Layout (composicional)

```typescript
// src/components/ui/Layout/index.tsx
export const Layout = {
  Root,        // SafeAreaView wrapper (aceita imagem de fundo)
  Header,      // Cabecalho com botao voltar + titulo
  Footer,      // Area de botoes no rodape
  Container,   // Flex container com gap
  List,        // FlatList wrapper
  SectionList, // SectionList wrapper
  Formulario,  // Form com SectionList + KeyboardAvoidingView
  Loading,     // Spinner centralizado
  Skeleton,    // Loading skeleton
  Empty,       // Estado vazio
  Error,       // Estado de erro
  Modal,       // Modal dialog
  Scroll,      // ScrollView wrapper
  Separator,   // Espacamento
  Title,       // Titulo de secao
  Button,      // Botao de acao
};
```

### Button

```typescript
// Variantes: default | outline | success | link | dark
// Tamanhos: small | medium | large | link
// Props: variant, size, iconLeft, iconRight, isLoading, label, color
<Button variant="outline" size="large" iconLeft={<Icon />} isLoading={loading}>
  Texto do botao
</Button>
```

### Card (composicional)

```typescript
export const Card = {
  Root,        // Container base
  Header,      // Cabecalho
  Content,     // Conteudo
  Title,       // Titulo
  Icon,        // Icone
  Image,       // Imagem
  Label,       // Label
  Badge,       // Badge
  Press,       // Pressable
  Footer,      // Rodape
  Collapsible, // Expansivel
  Empty,       // Estado vazio
  Loading,     // Skeleton
};
```

### Text

```typescript
// Variantes: titulo | subtitulo | paragrafo | link | small
// Props: type, color
<Text type="titulo" color="white">Titulo</Text>
<Text type="subtitulo">Subtitulo</Text>
<Text type="paragrafo">Texto normal</Text>
```

### View

```typescript
// Variantes: row | column | center
// Props: variant, backgroundColor
<View variant="row">
  <View variant="center">...</View>
</View>
```

---

## Formularios

### Padrao: Model Hook (logica de pagina)

```typescript
// src/models/use-page-[nome].tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  nome: z.string().min(1, "Campo obrigatorio"),
  email: z.string().email("Email invalido"),
});

type FormData = z.infer<typeof schema>;

export function usePageNome() {
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { nome: "", email: "" },
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    try {
      await service.create(data);
      Alert.alert("Sucesso", "Criado com sucesso!");
    } catch (error: any) {
      Alert.alert("Erro", error?.message || "Erro ao salvar.");
    }
  });

  return { form, handleSubmit };
}
```

### Inputs disponiveis

```typescript
// Text com mascaras: none | cep | cpf | cnpj | telefone | celular | currency | date | emailOrCpf
<InputText name="cpf" control={form.control} mask="cpf" label="CPF" />
<InputText name="valor" control={form.control} mask="currency" label="Valor" />

// Date picker
<InputDate name="data" control={form.control} label="Data" />

// Select
<InputSelect name="tipo" control={form.control} label="Tipo" options={options} />

// Radio
<InputRadio name="opcao" control={form.control} options={options} />

// Switch
<InputSwitch name="ativo" control={form.control} label="Ativo" />

// TextArea
<InputTextArea name="obs" control={form.control} label="Observacoes" />
```

---

## Mascaras de Input

```typescript
// src/helper/Mask.ts
cpfMask("12345678900")       // "123.456.789-00"
cnpjMask("12345678000190")   // "12.345.678/0001-90"
phoneMask("11999998888")     // "(11) 99999-8888"
birthDayMask("01012000")     // "01/01/2000"
maskCEP("01001000")          // "01001-000"
money(1500.50)               // "1.500,50"
money(1500.50, true)         // "R$ 1.500,50"
cpfCnpjMask("123")           // detecta automaticamente CPF ou CNPJ
```

---

## Path Aliases (tsconfig)

```json
{
  "baseUrl": "./src",
  "paths": {
    "@/*": ["./*"],
    "@images/*": ["../assets/images/*"],
    "@theme": ["./theme/index.ts"],
    "@components/*": ["./components/*"]
  }
}
```

---

## Variaveis de Ambiente

```env
EXPO_PUBLIC_API_URL=              # URL da API principal
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID= # Google OAuth web client ID
EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID= # Google OAuth iOS client ID
EXPO_PUBLIC_GOOGLE_SCOPES=        # Escopos do Google (separados por virgula)
```

---

## Plugins Expo (app.json)

```json
{
  "plugins": [
    "expo-router",
    ["expo-build-properties", { "ios": { "deploymentTarget": "15.5" } }],
    ["expo-splash-screen", { "image": "./assets/images/splashscreen.png" }],
    ["@react-native-google-signin/google-signin"],
    "expo-apple-authentication"
  ],
  "experiments": {
    "typedRoutes": true,
    "reactCompiler": true
  }
}
```
