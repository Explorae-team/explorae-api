# Exploraê - Monorepo (MVP)

## 🚀 Status Atual

O projeto foi unificado em um **Monorepo** para acelerar a entrega do MVP. O Backend (Spring Boot) está funcional, agora com estruturas de gamificação e catálogo de atrações prontas. O Frontend (React) aguarda a migração para Expo.

## 📂 Estrutura do Projeto

- `/backend`: API REST (Spring Boot, Java 25, PostgreSQL, JWT).
- `/frontend`: Aplicação Web (React/TypeScript - Migração para Expo pendente).
- `/docs`: Documentação de modelagem e requisitos.

## ✅ O que já foi feito (Atualizado em 26/03/2026)

### Backend

- [X] **Setup Inicial**: Spring Boot 4.0.3 configurado com Java 25.
- [X] **Banco de Dados**: Liquibase configurado com UUIDs.
- [X] **Segurança**: JWT funcional com login e registro de usuários.
- [X] **CORS**: Configurado para integração com o frontend.
- [x] **Preferências de Viagem**: Entidade `TravelPreference` e relacionamento com Usuário implementados (SDGEU-23).
- [x] **Gamificação**: Modelagem de XP, Nível, Medalhas (Badge) e Histórico (XpHistory) concluída (SDGEU-82).
- [x] **Atrações**: Entidade `Attraction` modelada com geolocalização, horários e faixa de preço (SDGEU-43).

### Infraestrutura/Organização

- [X] **Monorepo Setup**: Unificação dos repositórios para facilitar a sincronia de features.
- [x] **GitFlow**: Sincronização e merge realizados na branch `develop`.

## 📌 Próximos Passos (Backlog Imediato)

1. **SDGEU-83**: Criar serviço de XP e level up no backend.
2. **SDGEU-45**: Popular banco com atrações iniciais (Seeds/Migrations).
3. **SDGEU-19-FE**: Iniciar o setup do React Native (Expo) na pasta `/frontend`.
4. **Docker**: Criar `docker-compose.yml` para subir o ambiente completo.

## 🛠 Decisões Técnicas (Monorepo)

- **Sincronia**: Mudanças que afetam Back e Front devem ser feitas no mesmo PR.
- **Padrões**: Manter o `StandardResponseDTO` para comunicação consistente.
- **Commits**: Todas as mensagens de commit devem ser escritas em **Português**, seguindo o padrão de prefixos (feat, fix, chore, etc).
- **Gamificação**: Fórmula de nível baseada em `nível * 500` XP para o próximo nível.
- **Integridade**: Chaves estrangeiras de gamificação configuradas com `ON DELETE CASCADE`.

## 📝 Padrão de Comentários (Humano & Direto)

Mantemos o foco em comentários que explicam o "porquê" de forma objetiva e direta.

## 🗺️ Plano de Migração: React Web para React Native (Expo)

O frontend será convertido para **React Native com Expo** para gerar PWA e Apps Nativos.

### 1. Preparação do Ambiente
- [ ] Inicializar o Expo no diretório `/frontend`.
- [ ] Instalar dependências base (`expo-router`, `safe-area`, etc).

## 📈 Oportunidades de Otimização (Pós-MVP)
- **Performance de Autenticação:** Migrar para validação de Claims no Token JWT para reduzir consultas ao banco.

---

*Última atualização: 26 de março de 2026 - Conclusão das tarefas de modelagem de Gamificação e Atrações.*
