# PLAN - Phase 6: [SDGEU-221] Criar Interface de Filtros e Categorias (Expo/Native)

Este plano foca na construção da interface visual para busca, filtragem e categorização de atrações no Dashboard, seguindo os requisitos de design premium e os critérios do RF-005.

## 📝 Requisitos de UI (Baseado no RF-005)

- **Search Bar**: Input de busca textual com ícone de lupa e animação de foco.
- **Categorias**: Carrossel horizontal interativo para seleção rápida de nichos (Natureza, Cultura, etc.).
- **Filtros Rápidos**: Botão "Filtros" que abre um Bottom Sheet ou Modal.
- **Modal de Filtros**:
  - Seleção de Raio de Distância (Slider).
  - Faixa de Preço (Chips: $, $$, $$$).
  - Avaliação Mínima (Stars/Rating).
  - Switch "Aberto Agora".

## 🛠️ Design System & Componentes

- **Cores**: Manter a paleta `#00161e` (Surface), `#fd6c28` (Primary), `#bde9fe` (On-Surface).
- **Tipografia**: Uso consistente de Inter/Roboto.
- **Animações**: Transições suaves ao abrir filtros e selecionar categorias.

---

## 📅 Etapas de Execução

### Etapa 1: Navegação e Página de Busca
- [X] Atualizar `AppFooter.tsx` com a nova configuração de ícones e rotas.
- [X] Criar `src/app/dashboard/search.tsx` como a página dedicada de busca.
- [X] Implementar a navegação entre Dashboard e Busca.

### Etapa 2: Refatoração do CategoryCarousel
- [X] Atualizar `CategoryCarousel.tsx` para aceitar `selectedCategoryId` e `onSelect`.
- [X] Implementar feedback visual (active state) nos itens do carrossel.
- [X] Sincronizar ícones com as categorias reais do banco (Cultura, Praia, Histórico, Natureza, Compras, Lazer).

### Etapa 3: Componente SearchBar (na página de Busca)
- [X] Criar `src/components/dashboard/SearchBar.tsx`.
- [X] Estilizar com bordas suaves, background translúcido (glassmorphism feeling) e ícone `search`.

### Etapa 4: Botão e Modal de Filtros
- [X] Criar `src/components/dashboard/FiltersModal.tsx`.
- [X] Implementar o layout do Modal/Bottom Sheet:
    - Seção "Distância" com `Slider` (ou similar).
    - Seção "Preço" com botões de seleção múltipla.
    - Seção "Avaliação" com estrelas.
    - Seção "Disponibilidade" com `Switch`.
- [X] Adicionar botões "Limpar" e "Aplicar Filtros".

### Etapa 5: Integração na Tela de Busca
- [X] Inserir a `SearchBar` e o botão de Filtros na tela `search.tsx`.
- [X] Replicar o botão de Filtros na tela `Dashboard` (se necessário) para abrir a busca com filtros.
- [X] Garantir que o layout seja responsivo e mantenha o espaçamento premium.

---

## 🧪 Critérios de Aceite (UAT)

1. [X] O usuário consegue digitar no campo de busca.
2. [X] O usuário consegue selecionar uma categoria no carrossel e ver o destaque visual.
3. [X] O modal de filtros abre suavemente e contém todas as opções solicitadas no PRD.
4. [X] O design segue o padrão visual estabelecido no Dashboard (Dark Mode Premium).
5. [X] Nenhum erro de TypeScript ou quebra de layout em dispositivos móveis.

---

## ⚠️ Riscos e Dependências

- **Dependências**: Requer `react-native-community/slider` ou similar se optarmos por sliders nativos.
- **Escopo**: Esta fase é estritamente **UI/Layout**. A lógica de filtragem que altera o resultado da API será feita na **Phase 7**.
