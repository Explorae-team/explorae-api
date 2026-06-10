# Estrutura de Diretórios do Monorepo (STRUCTURE.md)

Este documento mapeia a organização dos arquivos e pastas no monorepo do **Exploraê**, destacando a localização das regras de negócio principais do backend e frontend.

---

## 📂 Estrutura de Pastas Principal

A estrutura raiz divide o projeto em backend, frontend, infraestrutura (Terraform) e documentação de planejamento ágil:

```text
explorae-api/
├── .planning/             # Pasta central de Planejamento (GSD)
│   ├── codebase/          # Mapas e análises da base de código (Este documento)
│   ├── milestones/        # Histórico de entregas e revisões de marcos
│   ├── phases/            # Detalhamentos das fases ativas
│   ├── PROJECT.md         # Escopo, requisitos e decisões chave
│   ├── ROADMAP.md         # Sequenciamento de fases e marcos
│   └── STATE.md           # Estado atual de desenvolvimento da Sprint
├── backend/               # API REST (Spring Boot, Java 25)
├── frontend/              # Aplicativo Mobile/PWA (Expo, TypeScript)
├── docs/                  # Diagramas e documentações de engenharia
├── terraform/             # Configurações de infraestrutura na nuvem (Iac)
├── .env.example           # Exemplo de variáveis de ambiente do monorepo
├── docker-compose.yml     # Orquestração do banco de dados PostgreSQL local
└── package.json           # Dependências da raiz e scripts globais
```

---

## ☕ 1. Estrutura Física do Backend (`/backend`)

O diretório `/backend` segue a estrutura clássica de projetos Maven (`src/main` para código produtivo e `src/test` para testes).

```text
backend/
├── src/
│   ├── main/
│   │   ├── java/br/edu/ifpb/explorae/       # Pacote Java Base
│   │   │   ├── api/                         # Camada Web REST Genérica
│   │   │   │   ├── exception/               # Manipuladores de Exceções Globais
│   │   │   │   └── DTOs/                    # DTOs compartilhados (StandardResponseDTO)
│   │   │   ├── config/                      # Configurações do Spring Boot (Security, CORS, Supabase, etc.)
│   │   │   ├── gamification/                # Módulo de Gamificação
│   │   │   │   ├── controller/              # Endpoints (Badge, Challenge, Reward)
│   │   │   │   ├── domain/                  # Entidades (Badge, Challenge, Reward, Voucher, XpHistory)
│   │   │   │   ├── dto/                     # DTOs específicos de Gamificação
│   │   │   │   ├── event/                   # Eventos assíncronos (UserLevelUpEvent, XpEarnedEvent)
│   │   │   │   ├── listener/                # Listeners de eventos de pontuação
│   │   │   │   ├── mapper/                  # Mapeadores MapStruct de conquistas
│   │   │   │   ├── repository/              # Repositórios JPA de gamificação
│   │   │   │   └── service/                 # Lógicas e Patterns de medalhas (Strategy)
│   │   │   ├── user/                        # Módulo de Autenticação e Usuários
│   │   │   │   ├── controller/              # Endpoints (AuthController, UserController, CategoryController)
│   │   │   │   ├── domain/                  # Entidades (User, TravelPreference, Category)
│   │   │   │   ├── dto/                     # DTOs específicos de Usuário
│   │   │   │   ├── mapper/                  # Mapeador MapStruct de usuário (UserMapper)
│   │   │   │   ├── repository/              # Repositórios JPA de perfil e preferências
│   │   │   │   └── service/                 # Serviços de autenticação e preferências
│   │   │   └── domain/                      # Entidades e repositórios de Atrações e Favoritos
│   │   └── resources/
│   │       ├── db/changelog/                # Arquivos XML do Liquibase (DDL e Seeds)
│   │       ├── application.properties       # Configurações globais do Spring
│   │       └── application-local.properties # Propriedades locais
│   └── test/                                # Testes Unitários e Integração do Spring
├── Dockerfile                               # Conteinerização do backend
├── mvnw                                     # Maven Wrapper para execução independente de IDE
└── pom.xml                                  # Arquivo de configuração de builds do Maven
```

---

## 📱 2. Estrutura Física do Frontend (`/frontend`)

O frontend utiliza Expo Router, organizado em grupos de rotas protegidas (`(auth)` e `(explore)`) para gerenciar a navegação.

```text
frontend/
├── src/
│   ├── app/                                 # Telas e Rotas (Expo Router)
│   │   ├── (auth)/                          # Roteamento público e autenticação
│   │   │   ├── login.tsx                    # Tela de Login
│   │   │   ├── cadastro.tsx                 # Tela de Cadastro
│   │   │   ├── recuperar-senha.tsx          # Recuperação de acesso
│   │   │   └── reset-password.tsx           # Redefinição de senha
│   │   ├── (explore)/                       # Roteamento privado da jornada
│   │   │   ├── attraction/                  # Sub-rota de detalhes da atração ([id].tsx)
│   │   │   ├── dashboard/                   # Painel (Mapa, Perfil, Conquistas, Cupons, Favorites)
│   │   │   ├── preferences.tsx              # Onboarding de Interesses de Viagem
│   │   │   └── settings.tsx                 # Configurações e Logout
│   │   ├── _layout.jsx                      # Componente Root de Roteamento e Contextos
│   │   └── index.jsx                        # Entrada padrão e redirecionamento inicial
│   ├── components/                          # Componentes Customizados Reutilizáveis
│   │   ├── attraction/                      # Cards de atração, modais de review
│   │   ├── profile/                         # Elementos do perfil do explorador
│   │   └── common/                          # Botões, barras de progresso genéricas
│   ├── constants/                           # Cores da marca, fontes e chaves
│   ├── contexts/                            # Provedores Globais de Estado (Auth, Celebration, Toast)
│   ├── hooks/                               # Hooks reutilizáveis (useAttraction, useBadges)
│   ├── services/                            # Axios client e chamadas (userService)
│   ├── styles/                              # Estilos globais Tailwind
│   └── types/                               # Arquivos de tipagem TypeScript
├── assets/                                  # Imagens estáticas, logotipos e fontes
├── scripts/
│   └── update-ip.cjs                        # Script automatizado de IP local
├── app.config.ts                            # Arquivo de configurações do Expo
├── package.json                             # Dependências do NodeJS
├── tailwind.config.cjs                      # Customização de estilos do Tailwind CSS
└── tsconfig.json                            # Configuração do compilador TypeScript
```
