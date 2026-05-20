# UI Specification - Attraction Card Component

## 🎯 Objetivo
Desenvolver o componente `AttractionCard` para a aplicação Expo/Mobile, traduzindo o design "Default Variant" do showcase HTML fornecido para React Native com NativeWind (Tailwind CSS).

## 🎨 Design Tokens (Horizon Design System)

| Propriedade | Token/Valor | Contexto |
| :--- | :--- | :--- |
| **Background** | `bg-surface-container-high` | Container principal do card |
| **Borda** | `rounded-2xl` (16px) | Arredondamento do card e imagens |
| **Sombra** | `shadow-lg` | Elevação visual (Android/iOS) |
| **Texto (Título)** | `text-on-surface`, `font-bold`, `text-lg` | Nome da atração |
| **Texto (Info)** | `text-on-surface-variant`, `text-sm` | Tagline e metadados |
| **Acento (Rating)** | `text-tertiary` | Estrelas e notas |
| **Overlay** | `bg-surface-bright/80` | Background dos badges sobre a imagem |

## 🧩 Component Structure (Anatomia)

### 1. Imagem de Capa (Header)
- **Altura**: 160px (`h-40`).
- **Badge de Tipo** (Top-Left): Ícone + Texto (ex: Sightseeing).
- **Botão Favoritar** (Top-Right): Ícone de coração (preenchido/vazio).

### 2. Seção de Conteúdo (Body)
- **Metadados (Row)**:
  - Rating: Ícone estrela (tertiary) + Nota.
  - Distância: Ícone local + Km.
- **Texto Principal**:
  - Título: Máximo 2 linhas.
  - Tagline: Máximo 1 linha (on-surface-variant).
- **Tags (Row)**:
  - Lista de tags horizontais com fundo `bg-surface-container`.

## 🛠️ Tecnologias
- **Expo / React Native**
- **NativeWind (Tailwind CSS v4)**
- **@expo/vector-icons** (MaterialIcons)
- **Expo Image** (Otimização de imagens)

## 📋 Critérios de Aceite (UAT)
- [ ] O card deve ser responsivo e ocupar a largura do container pai.
- [ ] O título deve truncar após 2 linhas.
- [ ] O botão de favoritar deve ser interativo (feedback visual).
- [ ] As cores devem seguir estritamente o `tailwind.config.cjs`.
- [ ] Deve suportar carregamento de imagem remota com placeholder.
