# Exploraê - User Service: Progresso e Contexto

## 🚀 Status Atual
O projeto está na fase inicial (Setup e MVP). As bases de dados e a entidade de usuário já foram configuradas.

## ✅ O que já foi feito
- [x] **Setup Inicial**: Spring Boot configurado com Java 17.
- [x] **Banco de Dados**: Configuração do Liquibase e criação da tabela `users` (UUID, email, password_hash, xp, level, coins).
- [x] **Entidades**: Criação da entidade `User` no pacote `domain.user`.
- [x] **Health Check**: `HealthController` implementado para validar o status da API.
- [x] **SDGEU-10**: Configurado tratamento de erros global (`@RestControllerAdvice`), CORS e banco H2 para testes.
- [x] **Git**: Branches `develop`, `feature/sdgeu-4-5-database-setup` e `feature/sdgeu-10-error-handling-cors` enviadas para o remoto.

## 📌 Próximos Passos (Backlog Imediato)
1. **SDGEU-15/17**: Implementar Spring Security com JWT (filtros, autenticação e geração de tokens).
2. **SDGEU-19**: Implementar endpoints de Cadastro de Usuário.

## 🛠 Decisões Técnicas
- **ID**: Uso de `UUID` para todos os identificadores de entidade.
- **Migrações**: Liquibase para controle de versão do banco.
- **Branching**: Workflow baseado em GitFlow (develop para integração, feature/* para tarefas).

---
*Última atualização: 18 de março de 2026*
