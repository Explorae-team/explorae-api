# SPEC - Phase 6: [SDGEU-221] Interface de Filtros e Categorias

## 🎯 Objetivo
Desenvolver os componentes de interface necessários para permitir que o usuário refine sua busca por atrações. Esta fase foca na **experiência visual e interativa (UX/UI)**, preparando o terreno para a integração lógica na fase seguinte.

## 🏗️ Escopo

### 1. Navegação (AppFooter)
- **Aba "Buscas"**: Ícone de lupa (`search-outline`), redireciona para `/dashboard/search`.
- **FAB "Explore"**: Ícone de bússola (`compass`), redireciona para `/dashboard` (Feed Principal).

### 2. Página de Busca (/dashboard/search)
- Página dedicada que agrupa a `SearchBar`, `CategoryCarousel` e o botão de `Filtros`.
- Exibe resultados de busca em tempo real (Mocked na Phase 6).

### 3. Componente SearchBar
- **Estética**: Estilo "Glassmorphism" suave ou Surface translúcido.
- **Funcionalidade**: Campo de texto com `clear` button e ícone de busca.
- **Animação**: Sombra suave ao focar e transição de borda.

### 2. CategoryCarousel (Refined)
- **Categorias Dinâmicas**: Mapeadas conforme o backend (`Cultura`, `Praia`, `Histórico`, `Natureza`, `Compras`, `Lazer`, `Gastronomia`).
- **Estados**: Selecionado vs Não Selecionado.
- **Interatividade**: Scroll horizontal suave e feedback tátil ao tocar.

### 3. FiltersModal
- **Tipo**: Modal de tela cheia ou Bottom Sheet.
- **Opções de Filtro**:
    - **Raio de Busca**: 1km a 50km.
    - **Preço**: Seleção de níveis ($, $$, $$$).
    - **Rating**: Estrelas (Mínimo de 3+, 4+, etc.).
    - **Status**: Toggle para "Aberto Agora".
- **Ações**: Botão de "Limpar" e "Aplicar".

## 🛠️ Tecnologias
- **React Native / Expo**
- **NativeWind (Tailwind CSS)**
- **Lucide Icons / Material Icons**
- **Expo Haptics** (Opcional, para feedback de seleção)

## 🎨 Protótipo Visual (Referência)
- Fundo: `#00161e`
- Elementos Ativos: `#fd6c28`
- Texto Secundário: `#8b9296`
- Bordas: `rgba(255, 255, 255, 0.05)`

## 📐 Definições Técnicas
- O estado dos filtros será mantido temporariamente no `ExploreScreen` e passado para o Modal.
- Nenhuma chamada de API nova será implementada nesta fase; utilizaremos mocks ou estados locais para validar a UI.
