# Exploraê - Monorepo (MVP)

## 🚀 Status Atual

O projeto foi unificado em um **Monorepo** e o frontend foi migrado de React Web (Vite) para **React Native (Expo)**. O backend está funcional e o ambiente está configurado para **Java 25**.

## 📂 Estrutura do Projeto

- `/backend`: API REST (Spring Boot 4.0.3, Java 25, PostgreSQL, JWT).
- `/frontend`: Aplicação Mobile/Web unificada (Expo/React Native).
- `/docs`: Documentação de modelagem e requisitos.

## ✅ O que já foi feito (Atualizado em 26/03/2026)

### Backend

- [X] **Setup Inicial**: Spring Boot 4.0.3 configurado com Java 25.
- [X] **Banco de Dados**: Liquibase configurado com UUIDs.
- [X] **Segurança**: JWT funcional com login e registro de usuários.
- [X] **CORS**: Configurado para integração com o frontend.
- [X] **Preferências de Viagem**: Entidade `TravelPreference` e relacionamento com Usuário implementados (SDGEU-23).
- [X] **Gamificação**: Modelagem de XP, Nível, Medalhas e Histórico concluída (SDGEU-82).
- [X] **Compatibilidade**: Ajuste de configurações da IDE e Maven para Java 25.

### Frontend (Migração Expo)

- [X] **Setup Mobile/Web**: Inicialização do Expo no diretório `/frontend`.
- [X] **Navegação**: Implementação do **Expo Router** (Arquivo-base).
- [X] **Migração de Telas**: Telas de Login, Cadastro e Dashboard convertidas para tags nativas.
- [X] **PWA**: Configuração base do manifest e web suporte funcional (SDGEU-13 / S1-P2-T4).

### Infraestrutura/Organização

- [X] **Monorepo Setup**: Unificação completa e limpeza de pastas redundantes.
- [X] **Git**: Branch `develop` atualizada e remotos sincronizados.

## 📌 Próximos Passos (Backlog Imediato)

1. **SDGEU-83**: Criar serviço de XP e level up no backend.
2. **Docker**: Finalizar o `docker-compose.yml` para incluir o serviço do backend (atualmente focado no DB).
3. **Assets**: Gerar e configurar ícones e splash screen oficiais na pasta `assets`.
4. **Persistência**: Migrar `localStorage` para `expo-secure-store` no `AuthContext.jsx`.
5. **Testes**: Implementar testes de integração no backend e E2E no mobile/web.

## 🛠 Decisões Técnicas (Monorepo)

- **Unificação**: Código unificado permite gerar Apps nativos e PWA da mesma base.
- **Padrões**: Manter o `StandardResponseDTO` e comentários diretos.
- **Ambiente**: Java 25 é o padrão LTS atual para o backend.

## 📈 Oportunidades de Otimização (Pós-MVP)
- **Performance de Autenticação:** Atualmente, o `JwtAuthenticationFilter` realiza uma consulta ao banco (`loadUserByUsername`) em **cada requisição**. Para escalar, podemos migrar para um modelo onde o filtro valida as permissões (Claims) diretamente do Token JWT, reduzindo a carga no banco de dados.

## 📝 Padrão de Comentários (Humano & Direto)

Mantemos o foco em comentários que explicam o "porquê" de forma objetiva e direta.

---

*Última atualização: 26 de março de 2026*
