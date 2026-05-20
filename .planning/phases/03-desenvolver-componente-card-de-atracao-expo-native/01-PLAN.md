# Phase Plan - [SDGEU-213] Desenvolver Componente Card de Atração (Expo/Native)

## 📋 Overview
Implementação do componente visual de card de atração para o feed principal, utilizando as especificações do `03-UI-SPEC.md` e integrando com o sistema de design NativeWind.

## 🛠️ Step-by-Step Implementation

### Step 1: Componente Base e Tipagem
- Criar `src/components/AttractionCard.tsx`.
- Definir interface `AttractionCardProps` (title, tagline, image, rating, distance, type, tags, isFavorite).
- Configurar estrutura básica com `View`, `Text` e `Image`.

### Step 2: Estilização com NativeWind
- Implementar o container com `bg-surface-container-high` e bordas arredondadas.
- Configurar o layout da imagem com overlays (badges e botão favoritar).
- Aplicar estilos de texto para título (truncado) e tagline.
- Implementar a lista de tags.

### Step 3: Integração de Ícones e Interatividade
- Adicionar ícones de `MaterialIcons` para rating, distância e tipo.
- Implementar o botão de favoritar com estado local inicial (ou prop-driven).
- Garantir que o card seja clicável (Touchable ou Pressable).

### Step 4: Refinamento Visual (Glassmorphism & Shadows)
- Ajustar transparências e blur nos badges sobre a imagem (usando `View` com opacidade no Android/iOS).
- Validar contraste das cores com o tema Dark.

## 🧪 Verification Plan

### Automated Tests
- Criar `__tests__/components/AttractionCard.test.tsx`.
- Testar renderização de props básicas.
- Testar truncamento de texto (snapshot ou check de linhas).

### Manual Verification (UAT)
- [ ] Verificar se o card renderiza corretamente no Expo Go.
- [ ] Validar se as cores batem com o `tailwind.config.cjs`.
- [ ] Testar interatividade do botão de favoritar.

## 🔗 Dependencies
- `@expo/vector-icons`
- `nativewind`
- `expo-image`
