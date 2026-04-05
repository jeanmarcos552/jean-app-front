# Prompts para Criar um Novo Projeto

Sequencia de prompts para criar um projeto React Native do zero seguindo a arquitetura base.

---

## Prompt 1 - Setup Inicial do Projeto

```
Crie um projeto React Native com Expo usando o seguinte setup:

1. Inicialize com: npx create-expo-app@latest [nome-do-app] --template blank-typescript
2. Instale as dependencias:

Dependencias principais:
- expo-router (navegacao file-based)
- @tanstack/react-query (data fetching)
- zustand (estado global)
- react-native-mmkv (storage local persistente)
- axios (HTTP client)
- zod (validacao de schemas)
- react-hook-form + @hookform/resolvers (formularios)
- @react-native-google-signin/google-signin (login Google)
- expo-apple-authentication (login Apple)
- react-native-reanimated (animacoes)
- react-native-safe-area-context
- react-native-screens
- react-native-gesture-handler
- date-fns (datas)

DevDependencies:
- @tanstack/eslint-plugin-query

3. Configure o tsconfig.json com strict mode e path aliases:
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "baseUrl": "./src",
    "paths": {
      "@/*": ["./*"],
      "@images/*": ["../assets/images/*"],
      "@theme": ["./theme/index.ts"],
      "@components/*": ["./components/*"]
    }
  }
}

4. Configure o app.json com:
- expo-router plugin
- expo-build-properties (iOS deploymentTarget: "15.5")
- expo-splash-screen
- @react-native-google-signin/google-signin plugin
- expo-apple-authentication plugin
- experiments: { typedRoutes: true, reactCompiler: true }
- scheme: "[nome-do-app]"
- newArchEnabled: true

5. Crie o .env.example:
EXPO_PUBLIC_API_URL=
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=
EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID=
EXPO_PUBLIC_GOOGLE_SCOPES=https://www.googleapis.com/auth/userinfo.email,https://www.googleapis.com/auth/userinfo.profile

6. Altere o "main" no package.json para "expo-router/entry"
```

---

## Prompt 2 - Estrutura de Pastas e Tema

```
Crie a estrutura de pastas e o sistema de tema:

1. Crie a arvore de pastas dentro de src/:
src/
├── app/
│   ├── (auth)/
│   └── (tabs)/
├── components/
│   └── ui/
│       ├── Buttons/
│       ├── Card/
│       ├── Inputs/
│       └── Layout/
├── features/
├── services/
├── queries/
├── stores/
├── contexts/
├── lib/
├── hooks/
├── models/
├── helper/
├── theme/
├── constants/
└── types/

2. Crie o arquivo de tema em src/theme/index.ts:
- Estrutura com 4 categorias: colors, background, border, shadows
- Cada categoria tem as mesmas keys: primary, secundary, warning, info, success, danger, gray, black, white
- colors: cores solidas para texto e icones
- background: cores com transparencia para fundos
- border: cores com transparencia para bordas
- shadows: cores solidas para sombras
- fonts: body (Montserrat-Medium), subtitulo (Montserrat-Medium), titulo (Montserrat-SemiBold)
- O tema e dark-first: fundo principal background.black = "#161616"

3. Crie src/constants/theme.ts que re-exporta:
export const Colors = theme.colors;
export const Background = theme.background;
export const Border = theme.border;
export const Fonts = theme.fonts;
export const WIDTH = Dimensions.get("window").width;
export const HEIGHT = Dimensions.get("window").height;

4. Crie src/hooks/use-custom-fonts.ts que carrega as fontes Montserrat usando expo-font.
```

---

## Prompt 3 - Componentes UI Base

```
Crie os componentes UI base seguindo o padrao composicional:

### Text (src/components/ui/Text.tsx)
- Props: type (titulo|subtitulo|paragrafo|link|small), color (chave de theme.colors), children
- Estilos por type:
  - titulo: fontFamily titulo, fontSize 20, fontWeight 700
  - subtitulo: fontFamily subtitulo, fontSize 16, fontWeight 600, color gray
  - paragrafo: fontFamily body
  - link: fontFamily body, underline, fontSize 14
  - small: fontFamily titulo, fontSize 12
- Cor padrao: theme.colors.white

### View (src/components/ui/View.tsx)
- Props: variant (row|column|center), backgroundColor (chave de theme.background), children
- Estilos: gap 12, flexDirection conforme variant

### Flex (src/components/ui/Flex.tsx)
- Mesmo que View mas com flex: 1 por padrao
- Props: flex (number, default 1)

### Button (src/components/ui/Buttons/index.tsx)
- Variantes de fundo: default (secundary), outline (transparente com borda), success, link, dark
- Tamanhos: small, medium, large, link
- Props: variant, size, iconLeft, iconRight, isLoading, label, color, disabled
- Quando isLoading=true, mostra ActivityIndicator no lugar do conteudo
- Manter a largura fixa durante loading (guardar width com onLayout)

### Card (src/components/ui/Card/index.tsx)
- Sistema composicional exportado como objeto:
  Card.Root - container base com backgroundColor theme.background.black, borderRadius, borderColor theme.border.black
  Card.Header - row com gap
  Card.Content - area de conteudo com padding
  Card.Title - titulo do card
  Card.Icon - container de icone
  Card.Image - imagem do card
  Card.Label - label secundario
  Card.Badge - badge
  Card.Press - versao pressable do Root
  Card.Footer - rodape
  Card.Collapsible - expandivel/recolhivel
  Card.Empty - estado vazio
  Card.Loading - skeleton

### Layout (src/components/ui/Layout/index.tsx)
- Sistema composicional:
  Layout.Root - SafeAreaView com fundo theme.background.black, aceita prop source (ImageBackground)
  Layout.Header - cabecalho com botao voltar (router.back), titulo e subtitulo
  Layout.Footer - area fixa no rodape para botoes de acao
  Layout.Container - flex container com gap
  Layout.List - wrapper de FlatList com RefreshControl
  Layout.SectionList - wrapper de SectionList
  Layout.Formulario - SectionList com KeyboardAvoidingView para formularios
  Layout.Loading - ActivityIndicator centralizado
  Layout.Skeleton - loading placeholder
  Layout.Empty - estado vazio com mensagem
  Layout.Error - estado de erro com mensagem
  Layout.Modal - modal dialog
  Layout.Scroll - ScrollView wrapper
  Layout.Separator - espacamento
  Layout.Title - titulo de secao
  Layout.Button - botao de acao
```

---

## Prompt 4 - Inputs de Formulario

```
Crie os componentes de input para formularios, todos integrados com react-hook-form (Controller):

### InputText (src/components/ui/Inputs/Text.tsx)
- Props: name, control, rules, mask, placeholder, label, defaultValue, keyboardType, secureTextEntry, returnRaw, maxLength, icon, error, loading, callback
- Mascaras suportadas: none, cep, cpf, cnpj, telefone, celular, currency, date, emailOrCpf
- Usa Controller do react-hook-form
- Estilos: fundo transparente, borda theme.border.gray, cor do texto white, placeholder gray
- Estado de foco muda borda para theme.colors.secundary
- Estado de erro muda borda para theme.colors.danger
- Label acima do input

### InputDate (src/components/ui/Inputs/Date.tsx)
- Date picker nativo por plataforma

### InputSelect (src/components/ui/Inputs/Select.tsx)
- Dropdown/picker de opcoes

### InputRadio (src/components/ui/Inputs/Radio.tsx)
- Grupo de radio buttons

### InputSwitch (src/components/ui/Inputs/Switch.tsx)
- Toggle switch

### InputTextArea (src/components/ui/Inputs/TextArea.tsx)
- Input multiline

### InputStyles (wrapper compartilhado)
- Wrapper que renderiza label, icone e mensagem de erro ao redor do input
- Reutilizado por todos os inputs

### Mascaras (src/helper/Mask.ts)
Implemente as seguintes funcoes de mascara:
- cpfMask: 000.000.000-00
- cnpjMask: 00.000.000/0000-00
- phoneMask: (00) 00000-0000
- birthDayMask: 00/00/0000
- maskCEP: 00000-000
- money(value, symbol?): formatacao brasileira com Intl.NumberFormat pt-BR
- cpfCnpjMask: detecta automaticamente CPF ou CNPJ pelo tamanho
```

---

## Prompt 5 - Camada de API e Autenticacao

```
Crie a camada de API, autenticacao com Google e gerenciamento de estado:

### API Axios (src/lib/api.ts)
- Crie instancia axios com baseURL de process.env.EXPO_PUBLIC_API_URL
- Request interceptor: adiciona header Authorization Bearer com token do useAuthStore.getState().api_token
- Response interceptor: em erro 401, chama clearSession() do auth store e redireciona para /(auth)/signin (com debounce de 100ms para evitar multiplos redirects)
- Funcao getApiErrorMessage() que extrai mensagem de erro do response (suporta campos: mensagem, mensagenserro array, message)
- Type ApiErrorResponse

### Auth Store Zustand (src/stores/auth.ts)
- Usa MMKV para persistencia: api_token, user (JSON), abilities (JSON)
- Estado: user, api_token, abilities, isBootstrapping, isLoading
- Acoes: initialize() (le do MMKV), setSession(), clearSession(), setLoading()

### Auth Context (src/contexts/authContexts.tsx)
- Provider que wrapa o app
- Chama initialize() do store no mount
- Funcao login(user, token, abilities): salva sessao e faz router.replace("/(tabs)")
- Funcao logout(): POST /logout na API, clearSession, queryClient.clear(), signOutFromGoogle()
- Hook useAuth() que retorna o contexto

### Google Sign-In Service (src/services/google-signin.service.ts)
- configureGoogleSignIn(): configura com webClientId e iosClientId das env vars
- signInWithGoogleProvider(): retorna { idToken, accessToken, serverAuthCode, user }
- signOutFromGoogle(): desconecta do Google (silencia erros)

### Auth Service (src/services/auth.service.ts)
- Schemas Zod para validar resposta de login (user com id, nome, email, token)
- signIn(login, senha): POST /login
- signInWithGoogle(payload): POST /login-google com email e google_token
- parseLoginResponse(): valida com Zod

### Model de Login (src/models/use-page-signin.tsx)
- Schema Zod: login (string min 1), senha (string min 3)
- useForm com zodResolver
- handleLogin: valida form -> signIn -> login(user, token, abilities)
- handleGoogleLogin: signInWithGoogleProvider -> signInWithGoogle -> login
- Try/catch com Alert.alert para erros
- setLoading no inicio e finally
```

---

## Prompt 6 - Telas de Autenticacao e Navegacao

```
Crie as telas de autenticacao e a estrutura de navegacao:

### Root Layout (src/app/_layout.tsx)
- Carrega fontes com useCustomFonts
- Chama configureGoogleSignIn() no useEffect
- Provider tree: GestureHandlerRootView > QueryClientProvider > AuthProvider > Stack
- Stack screens: (tabs) e (auth)/signin, ambas com headerShown: false

### Signin (src/app/(auth)/signin.tsx)
- Usa Layout.Root com imagem de fundo
- Logo centralizada na parte superior (Flex flex={2})
- Botoes na parte inferior:
  - "Entrar com Google" (Button com icone Google, chama handleGoogleLogin)
  - "Entrar com e-mail e senha" (Button variant="outline", navega para /(auth)/email-senha)
  - Se iOS: botao de login Apple
- Usa usePageSignIn() para logica

### Email e Senha (src/app/(auth)/email-senha.tsx)
- Layout.Root > Layout.Header com titulo "Entrar"
- Layout.Formulario com:
  - InputText name="login" label="E-mail ou CPF" mask="emailOrCpf"
  - InputText name="senha" label="Senha" secureTextEntry
  - Link para recuperar senha
- Layout.Footer com Button "Entrar" que chama handleLogin

### Tab Layout (src/app/(tabs)/_layout.tsx)
- Verifica user do useAuth(), se null -> Redirect para signin
- Tabs com fundo escuro (Background.black)
- Tab Home (index), e Perfil

### Home (src/app/(tabs)/index.tsx)
- Usa Layout.Root + Layout.SectionList
- Sections definidas como array de objetos { key, title?, data }
- ITEM_MAP mapeia cada item para um componente
- renderItem usa useCallback
```

---

## Prompt 7 - Padrao de Feature Completa (Service + Query + Tela)

```
Crie o padrao para uma feature completa como exemplo. Use como modelo:

### Service (src/services/exemplo.service.ts)
1. Defina schema Zod para o item (com transforms para normalizar tipos)
2. Defina schema para a resposta (array ou objeto)
3. Export type inferido do schema
4. Funcao parse que valida com try/catch
5. Funcoes async: fetchExemplos(), fetchExemploById(id), createExemplo(data), updateExemplo(id, data)

### Query Hook (src/queries/useExemplo.ts)
1. useExemplos() -> useQuery com queryKey ["exemplos"]
2. useExemploById(id) -> useQuery com queryKey ["exemplo", id] e enabled: !!id
3. useCreateExemplo() -> useMutation com invalidateQueries no onSuccess
4. useUpdateExemplo() -> useMutation com invalidateQueries no onSuccess

### Model (src/models/use-page-exemplo.tsx)
1. Schema Zod para o formulario
2. useForm com zodResolver
3. Handlers com try/catch e Alert.alert
4. Return: form, handlers, estados

### Tela (src/app/exemplo/index.tsx)
1. Layout.Root
2. Layout.Header com titulo
3. Layout.List ou Layout.Formulario para conteudo
4. Layout.Footer para acoes

Esse padrao se repete para toda nova feature:
Service (API + Zod) -> Query (React Query hooks) -> Model (logica de pagina) -> Tela (UI)
```

---

## Resumo da Ordem de Execucao

1. **Setup** - Projeto Expo, dependencias, configs
2. **Tema** - Design tokens, fontes, constantes
3. **UI Base** - Text, View, Flex, Button, Card, Layout
4. **Inputs** - Componentes de formulario com mascaras
5. **API + Auth** - Axios, Zustand, Google Sign-In, Context
6. **Navegacao** - Root layout, tabs, telas de auth
7. **Features** - Cada feature segue: Service -> Query -> Model -> Tela
