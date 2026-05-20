# ANALYSIS - Phase 6: Interface de Filtros e Categorias

## 🔍 Contexto
O usuário solicitou a criação da interface de filtros e categorias. No estado atual, o Dashboard já possui um carrossel de categorias estático e um botão de "Filtros" que não faz nada.

## 🛠️ Análise de Componentes Existentes

### 1. CategoryCarousel
- **Estado Atual**: Lista estática de categorias (`Natureza`, `Cultura`, `Gastronomia`, `História`, `Aventura`).
- **Problema**: O backend usa categorias ligeiramente diferentes (`Cultura`, `Praia`, `Histórico`, `Natureza`, `Compras`, `Lazer`).
- **Ação**: Sincronizar com as categorias do backend e adicionar suporte a seleção (`selected`).

### 2. Dashboard (ExploreScreen)
- **Estado Atual**: Exibe atrações reais mas sem controle de busca.
- **Ação**: Adicionar `SearchBar` no topo da seção "Descubra".

## 🚀 Proposta Técnica de UI

### SearchBar
- Utilizar `View` com `TextInput` interno.
- Estilo: Background `#ffffff0d` (10% opacity), borda rounded, ícone `search` à esquerda.

### FiltersModal
- Utilizar o componente `Modal` nativo do React Native para máxima compatibilidade.
- Seções bem divididas com títulos em `On-Surface-Variant` (cinza claro).
- Sliders e Chips para inputs de valor.

## 📉 Impacto no Projeto
- **Visual**: Melhora significativa na utilidade do feed.
- **Tamanho**: Mínimo (apenas componentes de UI).
- **Performance**: Nula (componentes simples).

## 💡 Recomendações
- Usar `Expo Haptics` ao selecionar categorias para dar uma sensação premium ao app.
- Manter o teclado gerenciado (`KeyboardAvoidingView` se necessário no modal).
