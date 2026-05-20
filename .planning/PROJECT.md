# Exploraê

## What This Is
O Exploraê é um guia turístico inteligente que oferece roteiros personalizados baseados no perfil do usuário, utilizando gamificação para incentivar a exploração de atrações locais.

## Core Value
Personalização da experiência turística através de perfis detalhados e recomendações inteligentes.

## Requirements

### Validated (Milestones Shipped)
- [x] **AUTH-01**: Registro e Login de usuários com JWT (Sprint 1)
- [x] **DATA-01**: Modelagem básica de Atrações e Geolocalização (Sprint 1)
- [x] **GAME-01**: Estrutura inicial de Gamificação (XP, Nível, Medalhas) (Sprint 1)
- [x] **PROF-01**: Gestão de Perfil (Visualização e Edição) (Sprint 2)
- [x] **TRAV-01**: Modelagem e API de Preferências Turísticas (Sprint 2)
- [x] **TRAV-02**: Fluxo Visual de Onboarding e Redirecionamento (Sprint 2)
- [x] **PROF-02**: Upload de Avatar com armazenamento seguro (Sprint 2)
- [x] **SDGEU-154**: Feed de Atrações com Infinite Scroll e paginação (Sprint 3)
- [x] **SDGEU-155**: Filtros de Atrações por categoria, preço e avaliação (Sprint 3)
- [x] **SDGEU-156**: Recomendações Inteligentes baseadas nas preferências do usuário (Sprint 3)
- [x] **SDGEU-157**: Detalhes da Atração com galeria e fotos completas (Sprint 3)

### Active (Sprint 04)
- [ ] **SDGEU-158**: Mapa Interativo com exibição geo-referenciada em tempo real.

### Out of Scope
- Gamificação social (Rankings globais)
- Sistema de reservas integrado
- Chat em tempo real entre usuários

## Context
- **Infraestrutura**: Monorepo com Backend (Spring Boot 4) e Frontend (Expo).
- **Segurança**: JWT configurado, autenticação via Header Authorization.
- **Banco**: PostgreSQL com Liquibase.

## Constraints
- **Tech Stack**: Java 25, Spring Boot 4.0.3, Expo (React Native), PostgreSQL.
- **Segurança**: Não quebrar contratos de autenticação existentes.
- **Padrões**: StandardResponseDTO para todas as respostas da API.

## Key Decisions
| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Monorepo | Facilidade de sincronia entre Back e Front | ✓ Good |
| UUIDs | Segurança e consistência de IDs no banco | ✓ Good |
| Tiers de XP | Gamificação visual baseada em cores (Bronze, Prata, Ouro) | ✓ Good |

---
*Last updated: 2026-05-20 for Sprint 04 Initialization*
