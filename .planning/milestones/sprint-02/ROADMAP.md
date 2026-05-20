# Roadmap - Sprint 02

## Phase 1: SDGEU-192 — Modelar preferências do usuário no backend (COMPLETED)
Definição da entidade e persistência base para personalização.

- [X] **Wave 1: Persistência**
    - [X] Liquibase Migration.
    - [X] JPA Entity Mapping.
    - [X] Repository Implementation.
    - [X] Persistence Unit Tests.

## Phase 2: SDGEU-191 — Gestão de Preferências via API (COMPLETED)
Exposição das preferências para o frontend.

- [X] **Wave 1: Camada de DTO & Service**
    - [X] `PreferenceRequestDTO`.
    - [X] `TravelPreferenceService`.
- [X] **Wave 2: Controller & Security**
    - [X] `TravelPreferenceController`.
    - [X] Integração com context de segurança.

## Phase 3: SDGEU-19-FE — Setup React Native (Expo) (COMPLETED)
Inicialização do novo frontend mobile e roteamento.

- [x] **Wave 1: Expo Init & Configuração de Fontes**
- [x] **Wave 2: Roteamento (Expo Router) e Estrutura de Pastas**

## Phase 4: SDGEU-22-FE — Tela de Preferências & Onboarding (COMPLETED)
Interface para o usuário selecionar seus interesses e redirecionamento inteligente.

- [x] **Wave 1: Componentização (InterestCard, InterestsGrid)**
- [x] **Wave 2: Lógica de Redirecionamento (_layout.jsx)**
- [x] **Wave 3: Integração com Backend e Persistência de Estado**

## Phase 5: SDGEU-83 — Sistema de XP & Level Up (COMPLETED)
Implementação da lógica de gamificação no backend para premiar ações do usuário.

- [X] **Wave 1: Serviço de Gamificação**
- [X] **Wave 2: Integração com Eventos de Usuário**

<!-- Fases 06 e 07 movidas para a Sprint 03 -->


## Phase 8: SDGEU-203 — Integração de Dados do Perfil (COMPLETED)
Conectar a UI de Perfil aos dados reais do AuthContext e API de Gamificação.

- [x] **Wave 1: Contexto & Perfil Básico**
    - [x] Consumir `user` do AuthContext no `ExplorerProfile`.
    - [x] Mapear Nome, Bio e Foto (Avatar).
- [x] **Wave 2: Gamificação & Stats**
    - [x] Integrar XP e Level nos componentes de progresso.
    - [x] Mapear lista de medalhas (Badges) reais no `AchievementsList`.
- [x] **Wave 3: UX & Feedback**
    - [x] Implementar Skeleton Loading/ActivityIndicator para carregamento inicial.
    - [x] Validar atualização em tempo real após edição de perfil.

## Phase 9: SDGEU-204 — Expansão do Perfil & Editabilidade (COMPLETED)
Refinamento da identidade visual e implementação de fluxos de edição direta.

- [x] **Wave 1: Identidade Visual Dinâmica**
    - [x] Bordas de avatar por nível e `levelName`.
    - [x] Testes de mapeamento de tiers (Backend).
- [x] **Wave 2: Edição In-line & Upload**
    - [x] Edição direta de Nome/Bio com validação.
    - [x] Upload de avatar via `expo-image-picker`.
    - [x] Testes de componente e interação (Frontend).
- [x] **Wave 3: Enriquecimento de Stats**
    - [x] Contexto em cards (Saldo Coins + Loja, Quests ativas).

## Phase 10: SDGEU-205 — Central de Configurações & Preferências (COMPLETED)
Hub de gestão de conta e edição profunda de preferências.

- [x] **Wave 1: UI de Configurações**
    - [x] Menu lateral/lista (Privacidade, Notificações, Segurança).
- [x] **Wave 2: Re-onboarding de Preferências**
    - [x] Fluxo para editar interesses salvos reutilizando UI do onboarding.
- [x] **Wave 3: Gestão de Dados (LGPD)**
    - [x] Exportação de dados e exclusão de conta (Mock/Confirmação).
