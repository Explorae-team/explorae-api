# Exploraê - Monorepo (MVP)

## 🚀 Status Atual

O projeto foi unificado em um **Monorepo**. O Backend (Spring Boot) está funcional com gamificação e catálogo de atrações. O Frontend foi migrado com sucesso para **Expo (React Native)** e o fluxo de onboarding de preferências está operando de forma estável.

## 📂 Estrutura do Projeto

- `/backend`: API REST (Spring Boot, Java 25, PostgreSQL, JWT).
- `/frontend`: Aplicação Mobile/PWA (Expo/TypeScript).
- `/docs`: Documentação de modelagem e requisitos.

## ✅ O que já foi feito (Concluído em 10/05/2026)

### Backend
- [X] **Setup Inicial**: Spring Boot 4.0.3 configurado com Java 25.
- [X] **Banco de Dados**: Liquibase configurado com UUIDs.
- [X] **Segurança**: JWT funcional com login e registro de usuários.
- [X] **CORS**: Configurado para integração com o frontend.
- [X] **Preferências de Viagem**: Entidade `TravelPreference` e relacionamento com Usuário (SDGEU-23).
- [X] **Serviço de Preferências**: Recuperação e atualização de interesses via API (SDGEU-191).
- [X] **Gamificação**: Modelagem de XP, Nível, Medalhas (Badge) e Histórico concluída (SDGEU-82).
- [X] **XP & Level Up**: Serviço de XP e progressão de nível implementado (SDGEU-83).
- [X] **Modelo de Atração**: Entidade `Attraction` e Repositório configurados (SDGEU-209).
- [X] **Seeds de Dados**: Banco populado com 20 atrações iniciais via Liquibase (SDGEU-211).
- [X] **API de Listagem**: Criar endpoint paginado para o Feed (Phase 4).
- [X] **Infraestrutura de Testes (Backend)**: Setup de H2 e application-test.properties para testes isolados (Phase 14-BE).

### Frontend (Mobile - Expo)
- [X] **Setup Expo**: Inicialização com Expo Router e TypeScript (SDGEU-19-FE).
- [X] **Auth Flow**: Login e Registro integrados com o backend.
- [X] **Onboarding**: Tela de Preferências com seleção de interesses e redirecionamento forçado (SDGEU-22-FE).
- [X] **Perfil do Explorador**: Interface integrada com dados reais, XP, Nível, Medalhas e Histórico (SDGEU-203).
- [X] **Configurações & Preferências**: Central de configurações, logout e re-onboarding de interesses (SDGEU-205).
- [X] **Componentes UI**: Componente `AttractionCard` (Variant: Default) implementado e testado (SDGEU-213).
- [X] **Dashboard Explore**: Tela principal integrada com o backend, carregando atrações reais com paginação (Phase 5).
- [X] **Infraestrutura de Testes (Frontend)**: Estabilização de mocks do Axios e Jest para ambiente Expo (Phase 14-FE).

## 📌 Próximos Passos (Sprint 03)

1. **Dashboard**: Iniciar a construção da tela principal (Explore) consumindo as preferências.
2. [ ] **Docker**: Criar `docker-compose.yml` para subir o ambiente completo.

## 🛠 Decisões Técnicas (Monorepo)
- **Sincronia**: Mudanças que afetam Back e Front devem ser feitas no mesmo PR.
- **Padrões**: Manter o `StandardResponseDTO` para comunicação consistente.
- **Commits**: Todas as mensagens de commit devem ser escritas em **Português**, seguindo o padrão de prefixos (feat, fix, chore, etc).
- **Gamificação**: Fórmula de nível baseada em `nível * 100` XP para o próximo nível.
- **Onboarding**: Usuários sem preferências são obrigatoriamente redirecionados para `/preferences`.

## 📝 Padrão de Comentários (Humano & Direto)
Mantemos o foco em comentários que explicam o "porquê" de forma objetiva e direta.

## 📈 Oportunidades de Otimização (Pós-MVP)
- **Performance de Autenticação:** Migrar para validação de Claims no Token JWT para reduzir consultas ao banco.

---

*Última atualização: 10 de maio de 2026 - Conclusão da Infraestrutura de Testes & Estabilização da Suíte.*
