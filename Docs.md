# Documentação do Projeto — HERSAFE

Bem-vindo à documentação do projeto. Este documento explica a estrutura arquitetural, navegação e o design system adotado.

---

## Arquitetura de Pastas

O código fonte está isolado em `src/` para separar a lógica dos arquivos de configuração globais.

```
my-expo-app/
├── App.tsx                     # Ponto de entrada — envolve o app em providers
├── global.css                  # Design tokens via variáveis CSS + directives Tailwind
├── tailwind.config.js          # Mapeia as variáveis CSS em classes Tailwind
├── src/
│   ├── theme/
│   │   └── colors.ts           # Tokens de cor como objeto TypeScript (para StyleSheet)
│   ├── navigation/
│   │   └── AppNavigator.tsx    # Configuração das rotas e bottom tab bar
│   └── screens/
│       ├── HomeScreen.tsx
│       ├── GroupScreen.tsx
│       ├── ProfileScreen.tsx
│       └── SettingsScreen.tsx
```

---

## Navegação (React Navigation)

O projeto usa **React Navigation** com a abordagem **Bottom Tabs** (navbar inferior).

O `AppNavigator.tsx` registra 4 telas:

| Rota       | Tela                | Ícone (Ionicons) |
|------------|---------------------|------------------|
| `Home`     | `HomeScreen`        | `shield`         |
| `Group`    | `GroupScreen`       | `people`         |
| `Profile`  | `ProfileScreen`     | `person`         |
| `Settings` | `SettingsScreen`    | `settings`       |

---

## Design System

O projeto usa **NativeWind** (Tailwind para React Native) com um design system centralizado.

### Como funciona

1. **`global.css`** define as variáveis CSS (`:root { --color-primary: ... }`)
2. **`tailwind.config.js`** mapeia cada variável para uma classe Tailwind (`bg-primary`, `text-emergency`, etc.)
3. **`src/theme/colors.ts`** exporta os mesmos tokens como objeto TypeScript para uso em props nativas (`StyleSheet`, `Switch`, `StatusBar`, etc.)

### Exemplo de uso

```tsx
// ✅ Via className (NativeWind) — preferido
<View className="bg-surface border border-border rounded-lg p-4">
  <Text className="text-text font-bold">Olá!</Text>
  <Text className="text-text-muted">Subtítulo</Text>
</View>

// ✅ Via colors.ts — para props nativas que não aceitam className
import { colors } from '../theme/colors';
<Switch trackColor={{ false: colors.surface3, true: colors.primaryMuted }} />
```

---

## Paleta de Cores

### Tema: Dark (cinza profundo)

| Token Tailwind       | Variável CSS              | Hex       | Uso                          |
|----------------------|---------------------------|-----------|------------------------------|
| `bg-bg`              | `--color-bg`              | `#121218` | Fundo principal              |
| `bg-surface`         | `--color-surface`         | `#1C1C27` | Cards, painéis               |
| `bg-surface-2`       | `--color-surface-2`       | `#252535` | Inputs, elementos elevados   |
| `bg-surface-3`       | `--color-surface-3`       | `#2E2E42` | Bordas, hover de card        |

### Primary — Violeta Proteção

| Token Tailwind         | Hex       | Uso                        |
|------------------------|-----------|----------------------------|
| `bg-primary`           | `#8B5CF6` | Botões, links              |
| `bg-primary-light`     | `#A78BFA` | Hover, ícones ativos       |
| `bg-primary-dark`      | `#6D28D9` | Pressed, foco              |
| `bg-primary-muted`     | `#3B1F6E` | Fundo de badges            |

### Emergency — Rosa SOS

| Token Tailwind           | Hex       | Uso                          |
|--------------------------|-----------|------------------------------|
| `bg-emergency`           | `#E91E8C` | **Botão SOS** — ação crítica |
| `bg-emergency-light`     | `#F472B6` | Ícones de alerta             |
| `bg-emergency-dark`      | `#BE185D` | Pressed do SOS               |
| `bg-emergency-muted`     | `#4A0D2E` | Fundo de zona de risco       |

### Semantic — Status

| Token         | Hex       | Uso                           |
|---------------|-----------|-------------------------------|
| `text-safe`   | `#10B981` | Status "estou segura"         |
| `text-warning`| `#F59E0B` | Alertas moderados             |
| `text-danger` | `#EF4444` | Erros, falhas                 |

### Texto

| Token              | Hex       | Uso                     |
|--------------------|-----------|-------------------------|
| `text-text`        | `#F0EFFE` | Texto principal         |
| `text-text-muted`  | `#9B98B8` | Subtítulos, labels      |
| `text-text-dim`    | `#5C5A7A` | Desabilitado, secondário|

---

## Tokens de Espaçamento e Radius

O espaçamento segue a escala padrão do Tailwind (múltiplos de 4px). O radius tem tokens nomeados:

| Classe Tailwind  | Valor  | Uso                        |
|------------------|--------|----------------------------|
| `rounded-sm`     | 6px    | Badges, chips              |
| `rounded-md`     | 10px   | Botões, inputs             |
| `rounded-lg`     | 16px   | Cards                      |
| `rounded-xl`     | 24px   | Modais, bottom sheets      |
| `rounded-full`   | 9999px | Avatares, FABs             |

---

## Adicionando Novas Telas

1. Crie o arquivo em `src/screens/NovaScreen.tsx`
2. Use `bg-bg` como fundo padrão da tela
3. Registre a rota no `AppNavigator.tsx`
4. Sempre use os tokens do design system — nunca escreva cores hexadecimais diretamente no JSX
