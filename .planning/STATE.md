# State - Sprint 06

## Context
Iniciando a Sprint 06 do Exploraê, focada inteiramente na refatoração e conformidade com os princípios SOLID no módulo `user` do backend. Atualmente, o módulo possui alta responsabilidade acumulada na classe `UserService` (God Service sem interface contratual) e no controller, com injeções diretas e validações misturadas. Essa sprint organizará a arquitetura do módulo para torná-lo flexível e limpo para as próximas extensões.

## Current Phase
- **Active**: Phase 1 - [SDGEU-REF-USER-1] Criar interfaces de serviços para `UserService` e `AuthService` e adequar injeções de dependência no backend
- **Status**: ⌛ Ready to discuss.

## Recent Progress
- [X] Conclusão e auditoria da Sprint 05 (Check-In por Proximidade e Vouchers) com testes 100% verdes.
- [X] Mesclagem das atualizações de planejamento na branch `main`.

## Session Continuity
- **Last session**: 2026-06-13
- **Stopped at**: Sprint 05 closed and Sprint 06 (refactor_backend) initialized.
- **Resume file**: .planning/ROADMAP.md

## Notes
- Garantir que a criação das interfaces de serviço não quebre as dependências do Spring Security (como o `UserDetailsService` do `UserService`).
- Preservar a consistência das transações (`@Transactional`) nas novas implementações.
