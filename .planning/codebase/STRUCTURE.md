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
│   │   │   ├── api/                         # Camada Web REST
│   │   │   │   ├── controller/              # Endpoints HTTP da API
│   │   │   │   ├── dto/                     # Classes de Transferência de Dados (DTO)
│   │   │   │   ├── exception/               # Manipuladores de Exceções Globais
│   │   │   │   └── mapper/                  # Mapeamentos MapStruct
│   │   │   ├── config/                      # Configurações do Spring Boot (Security, CORS, etc.)
│   │   │   ├── domain/                      # Entidades de Domínio do JPA
│   │   │   │   ├── attraction/              # Atrações, reviews, check-ins, favoritos
│   │   │   │   ├── gamification/            # Badges, desafios, históricos de XP
│   │   │   │   └── user/                    # Entidade User, categorias e preferências
│   │   │   ├── listener/                    # Triggers assíncronos (Gamification, Desafios)
│   │   │   └── service/                     # Lógicas de Negócio e Serviços
│   │   │       └── badge/                   # Estratégias do Strategy Pattern de medalhas
│   │   └── resources/
│   │       ├── db/changelog/                # Arquivos XML do Liquibase (DDL e Seeds)
│   │       ├── application.properties       # Configurações globais do Spring
│   │       └── application-prod.properties  # Propriedades para ambiente de produção
│   └── test/                                # Testes Unitários e Integração do Spring
├── Dockerfile                               # Conteinerização do backend
├── mvnw                                     # Maven Wrapper para execução independente de IDE
└── pom.xml                                  # Arquivo de configuração de builds do Maven
```

---

## 📱 2. Estrutura Física do Frontend (`/frontend`)

O frontend utiliza Expo Router, onde os arquivos contidos em `/src/app` representam automaticamente as telas do aplicativo.

```text
frontend/
├── src/
│   ├── app/                                 # Telas e Rotas (Expo Router)
│   │   ├── attraction/                      # Sub-rotas de detalhes e reviews
│   │   ├── dashboard/                       # Módulos principais (Mapa, Perfil, Conquistas)
│   │   ├── _layout.jsx                      # Componente Root de Roteamento e Contextos
│   │   ├── index.jsx                        # Ponto de entrada padrão
│   │   ├── login.tsx                        # Tela de Login
│   │   ├── cadastro.tsx                     # Tela de Cadastro
│   │   ├── preferences.tsx                  # Onboarding de Interesses de Viagem
│   │   └── settings.tsx                     # Ajustes e Logout
│   ├── components/                          # Componentes Customizados Reutilizáveis
│   │   ├── attraction/                      # Cards de atração, modais de review
│   │   ├── profile/                         # Elementos do perfil do explorador
│   │   └── common/                          # Botões, barras de progresso genéricas
│   ├── constants/                           # Cores da marca, fontes e chaves
│   ├── contexts/                            # Provedores Globais de Estado (Auth, Badge)
│   ├── hooks/                               # Hooks reutilizáveis (useLocation, etc.)
│   ├── services/                            # Axios clients, chamadas de API
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
