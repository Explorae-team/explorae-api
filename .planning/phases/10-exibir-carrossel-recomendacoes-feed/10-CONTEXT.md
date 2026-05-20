# Phase 10: Exibir Carrossel de Recomendações no Feed (Expo/Native) - Context

**Gathered:** 2026-05-20
**Status:** Ready for planning

<domain>
## Phase Boundary

Esta fase entrega a integração completa das recomendações inteligentes personalizadas na interface do feed (Expo/React Native). Substituiremos as fatias genéricas no topo e reordenaremos o feed principal "Descubra" utilizando a API híbrida robusta desenvolvida no backend.

</domain>

<decisions>
## Implementation Decisions

### 📍 Geolocalização & Permissões
- **D-01 (Opção A ativa - size=15):** A aplicação mobile utilizará `expo-location` para solicitar a permissão de geolocalização do usuário de forma ativa ao entrar na tela principal do dashboard.
- **D-02 (Geolocalização Fallback):** Caso a permissão seja concedida, as coordenadas reais de latitude/longitude serão obtidas e enviadas para o endpoint de recomendações `/api/v1/attractions/recommendations?size=15`. Se a permissão for negada, o fluxo prossegue com coordenadas nulas e o backend faz o cálculo sem distância de forma transparente.

### ❄️ Cold Start & Prevenção de Perfil Vazio
- **D-03 (Enforcement no Onboarding):** Não é permitido prosseguir a partir da tela de preferências (`preferences.tsx`) sem que o usuário selecione **pelo menos 1 interesse para cada uma das cinco categorias/pilares** do onboarding (`gastronomia`, `cultura`, `aventura`, `relaxamento`, `noite`).
- **D-04 (Eliminação de Estado Vazio):** Como o usuário é obrigado a preencher interesses válidos no onboarding antes de acessar o feed principal, o feed sempre possuirá dados explícitos para gerar recomendações personalizadas reais. Não há necessidade de fallbacks para feed vazio por falta de preferências.

### 📏 Volume de Dados & Organização do Feed (Carrossel vs Descubra)
- **D-05 (Carrossel Superior):** O carrossel horizontal "Recomendado para você" exibirá **apenas as 10 principais atrações** recomendadas (fatiando a resposta de 15 itens). Não haverá paginação ou scroll infinito horizontal no carrossel superior para garantir performance e foco.
- **D-06 (Feed Descubra Personalizado):** O feed vertical principal "Descubra" localizado no fim do Dashboard também passará a trazer **primeiramente as recomendações personalizadas do usuário** ordenadas conforme suas preferências de viagem.
- **D-07 (Paginação de 10 em 10):** O feed "Descubra" consumirá o endpoint de recomendações de forma paginada (`page=0, 1, 2...` e `size=10`). Caso filtros específicos (como categorias no carrossel de categorias, preços ou avaliações) sejam aplicados pelo usuário, o feed "Descubra" voltará a usar o endpoint geral de busca `/api/v1/attractions` respeitando esses filtros.

### 🎨 Identificação Visual
- **D-08 (Ordenação Natural):** Não haverá tags ou selos visuais explícitos (ex: "X% de Match" ou "Recomendado por interesse") nos cards do feed vertical "Descubra". A ordenação por afinidade será sutil e natural.
- **D-09 (Card Reutilizado):** O carrossel superior de recomendações utilizará o componente `<AttractionCard variant="compact" />` já existente, identificando-se através do título da seção "Recomendado para você".

### the agent's Discretion
- **F-01 (Estado de Carregamento):** O agente tem total liberdade para projetar e renderizar os skeletons (`AttractionSkeleton`) e indicadores de progresso durante as requisições paralelas do carrossel superior e do feed inferior.
- **F-02 (Integração de Localização):** Fica a critério do agente decidir se o hook encapsulará a obtenção de localização em cache ou fará uma nova chamada assíncrona rápida a cada refresh.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Requisitos e Roadmap
- `.planning/ROADMAP.md` — Roteiro de entregas da Sprint 03.
- `.planning/REQUIREMENTS.md` §[SDGEU-156] — Definições de caso de uso e critérios de aceitação para Recomendações Inteligentes.

### Backend Contracts
- `backend/src/main/java/br/edu/ifpb/explorae/api/controller/AttractionController.java` — Controlador que expõe a rota GET `/api/v1/attractions/recommendations` (latitude, longitude, pageable).
- `backend/src/main/java/br/edu/ifpb/explorae/service/AttractionService.java` — Lógica do cálculo de scores híbridos ( explicit + implicit + distance + partner boost).

### Frontend Routing & Onboarding
- `frontend/src/app/dashboard/index.tsx` — Dashboard do Feed principal onde o carrossel e o feed "Descubra" serão acoplados.
- `frontend/src/app/preferences.tsx` — Fluxo visual de preferências.
- `frontend/src/hooks/usePreferencesWizard.js` — Lógica de passos que deve ser atualizada com a validação por categoria.
- `frontend/src/constants/onboarding.js` — Categorias e pilares oficiais do onboarding de interesses.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `<AttractionCard variant="compact" />` em `frontend/src/components/dashboard/AttractionCard.tsx` — Card compacto ideal para renderização no carrossel horizontal de recomendações.
- `useExploreData` em `frontend/src/services/useExploreData.ts` — Hook que serve como excelente padrão arquitetural para construir o novo hook de recomendações (ex: `useRecommendationsData` ou similar).
- `preferenceService.getCategories()` em `frontend/src/services/preferenceService.js` — Método de API pronto para recuperar as categorias cadastradas no sistema e permitir a validação do wizard.

### Established Patterns
- **StandardResponseDTO**: O backend envelopa todas as respostas com a chave `.data` (ex: `response.data.data.content` para paginações).
- **Tailwind / NativeWind**: Classes utilitárias do TailwindCSS para estilização dinâmica.
- **Axios API Client**: Cliente Axios configurado e exportado em `frontend/src/services/api.js`.

### Integration Points
- `/api/v1/attractions/recommendations` no frontend Expo para alimentar o feed e o carrossel.
- Método `handleNext` e `handleFinish` em `frontend/src/hooks/usePreferencesWizard.js` para interceptar e validar escolhas de interesses.

</code_context>

<specifics>
## Specific Ideas
- A validação no `usePreferencesWizard.js` deve alertar o usuário de forma amigável (via `Alert.alert`) caso ele clique em "Avançar" sem marcar pelo menos uma opção para a categoria ativa, garantindo consistência total do perfil.

</specifics>

<deferred>
## Deferred Ideas
- Nenhum — a discussão cobriu estritamente o domínio da Fase 10.

</deferred>

---

*Phase: 10-Exibir Carrossel de Recomendações no Feed*
*Context gathered: 2026-05-20*
