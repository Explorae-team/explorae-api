# Diagramas de Sequência - Exploraê

Este documento ilustra os fluxos principais do projeto usando diagramas de sequência. Esses diagramas detalham a comunicação entre o Frontend (Mobile App), o Backend (Spring Boot), o Banco de Dados (Supabase) e os Serviços internos.

---

## 1. Autenticação e Onboarding de Preferências

Este fluxo cobre o primeiro contato do usuário com o app, desde a criação da conta até o preenchimento obrigatório das preferências de viagem.

```mermaid
sequenceDiagram
    actor User as Usuário
    participant App as Mobile App (Expo)
    participant Auth as AuthController
    participant Pref as PreferenceController
    participant DB as Banco de Dados

    User->>App: Preenche dados de Registro
    App->>Auth: POST /auth/register
    Auth->>DB: Salva User (Hash da senha)
    DB-->>Auth: User criado
    Auth-->>App: Retorna JWT Token
    App->>App: Salva Token (SecureStore)
    
    %% Redirecionamento forçado para Preferências
    App->>Pref: GET /api/v1/users/preferences (com Token)
    Pref->>DB: Busca Preferências
    DB-->>Pref: Não encontrado (null)
    Pref-->>App: Redireciona para Onboarding
    
    App-->>User: Exibe Tela de Seleção de Interesses
    User->>App: Escolhe Cultura, Natureza, etc.
    App->>Pref: POST /api/v1/users/preferences
    Pref->>DB: Salva TravelPreference
    DB-->>Pref: OK
    Pref-->>App: Status 200 OK
    App-->>User: Redireciona para o Dashboard (Feed)
```

---

## 2. Feed Paginado e Carrossel

Fluxo que descreve como o aplicativo carrega as atrações para exibir na tela principal do Explorador, baseando-se em geolocalização.

```mermaid
sequenceDiagram
    actor User as Usuário
    participant App as Mobile App
    participant Feed as AttractionController
    participant DB as Banco de Dados

    User->>App: Abre o Dashboard
    App->>App: Obtém Geolocalização do Aparelho (Lat/Lng)
    App->>Feed: GET /api/v1/attractions/feed?lat=X&lng=Y&page=0
    Feed->>DB: Busca atrações próximas + ordenação por Score
    DB-->>Feed: Retorna Lista Paginada
    Feed-->>App: JSON com atrações
    App-->>User: Renderiza Carrossel e Feed Vertical
```

---

## 3. Check-in, Avaliação e Gamificação

Este é o fluxo principal de engajamento do projeto. Ocorre quando o usuário visita uma atração, adiciona uma foto/review e o motor de gamificação é acionado para calcular os prêmios.

```mermaid
sequenceDiagram
    actor User as Usuário
    participant App as Mobile App
    participant API as AttractionController
    participant Storage as Supabase Storage
    participant Gamification as GamificationService
    participant DB as Banco de Dados

    User->>App: Faz Check-in e anexa Foto
    
    %% Upload da Foto
    App->>API: POST /api/v1/attractions/reviews/upload (FormData)
    API->>Storage: Envia arquivo (Bucket 'reviews')
    Storage-->>API: Retorna URL pública da imagem
    API-->>App: URL da foto
    
    %% Envio da Avaliação
    App->>API: POST /api/v1/attractions/reviews
    API->>DB: Salva AttractionReview (URL, texto, rating)
    
    %% Motor de Gamificação
    API->>Gamification: processarCheckin(userId)
    Gamification->>DB: addXP(XP_CHECKIN) & addCoins(COINS_CHECKIN)
    Gamification->>Gamification: checkLevelUp()
    Gamification->>Gamification: checkBadges(histórico do usuário)
    Gamification->>DB: Salva XpHistory e UserBadge (se houver)
    
    Gamification-->>API: Retorna GamificationResult (LevelUp? Badges?)
    API-->>App: JSON com Status e GamificationResult
    
    App-->>User: Exibe Modal "Você ganhou 50 XP e 5 Moedas!"
```

---

## 4. Loja de Recompensas e Resgate (Sprint 6)

Este diagrama documenta a arquitetura que planejamos para a Sprint 6, demonstrando a relação entre o catálogo (Rewards) e a carteira do usuário (Vouchers).

```mermaid
sequenceDiagram
    actor User as Usuário
    participant App as Mobile App
    participant RewardAPI as RewardController
    participant RewardSvc as RewardService
    participant DB as Banco de Dados

    %% Consulta de Catálogo
    User->>App: Acessa aba "Loja XP"
    App->>RewardAPI: GET /api/v1/rewards
    RewardAPI->>DB: Busca Rewards onde stock > 0 e is_active = true
    DB-->>RewardAPI: Retorna lista
    RewardAPI-->>App: Renderiza RewardCards
    
    %% Resgate
    User->>App: Clica em "Resgatar" (-500 Moedas)
    App->>RewardAPI: POST /api/v1/rewards/redeem/{id}
    RewardAPI->>RewardSvc: executarResgate()
    
    RewardSvc->>DB: Verifica saldo do User (>= 500)
    RewardSvc->>DB: Verifica estoque do Reward (>= 1)
    
    %% Transação atômica
    RewardSvc->>DB: User.coins = User.coins - 500
    RewardSvc->>DB: Reward.stock = Reward.stock - 1
    RewardSvc->>DB: Cria Voucher(code=UUID, status=ACTIVE)
    
    DB-->>RewardSvc: OK
    RewardSvc-->>RewardAPI: Retorna Voucher DTO
    RewardAPI-->>App: Sucesso + Voucher Data
    
    %% Pós Resgate
    App-->>User: Exibe Tela "Resgate Concluído!"
    User->>App: "Ver QR Code"
    App->>App: Gera QR Code com o UUID do Voucher na tela
```
