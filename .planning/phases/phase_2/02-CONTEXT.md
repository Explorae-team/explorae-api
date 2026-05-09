# Phase 2: SDGEU-191 — Gestão de Preferências via API - Context

**Gathered:** 2026-05-09
**Status:** Ready for planning

<domain>
## Phase Boundary

Esta fase entrega a API REST (GET e PUT) para gestão das preferências de viagem (interesses) do usuário autenticado no backend Spring Boot.

</domain>

<decisions>
## Implementation Decisions

### Protocolo e Semântica HTTP
- **D-01:** O endpoint para salvar/atualizar preferências será **PUT** `/api/v1/users/me/preferences`. A decisão baseia-se na idempotência do método PUT para operações de substituição total do estado do recurso.
- **D-02:** O endpoint para consulta será **GET** `/api/v1/users/me/preferences`.

### Estrutura de Dados e Resposta
- **D-03:** O endpoint de consulta (GET) deve retornar **apenas a lista de preferências** (interesses), simplificando a interface para o frontend.
- **D-04:** Todas as respostas da API devem seguir estritamente o padrão `StandardResponseDTO`.
- **D-05:** O DTO de resposta `StandardResponseDTO` foi atualizado para incluir o campo `errors` e ignorar campos nulos na serialização JSON.

### Padronização e Tratamento de Erros
- **D-06:** O tratamento de exceções deve ser padronizado utilizando um `GlobalExceptionHandler` (ControllerAdvice).
- **D-07:** Erros de validação e exceções de negócio devem retornar o `StandardResponseDTO` com a mensagem apropriada e detalhes no campo `errors` quando aplicável.

### Rotas e Prefixos
- **D-08:** Deve-se seguir o padrão do projeto utilizando o prefixo `/api/v1` em todas as rotas de preferências.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Core Backend Patterns
- `backend/src/main/java/br/edu/ifpb/explorae/api/dto/StandardResponseDTO.java` — Padrão obrigatório para todas as respostas da API.
- `backend/src/main/java/br/edu/ifpb/explorae/domain/user/TravelPreference.java` — Entidade de domínio para persistência de interesses.

### Project Specs
- `.planning/REQUIREMENTS.md` — Requisitos de negócio validados (TRAV-02, TRAV-03).
- `.planning/ROADMAP.md` — Definição da Wave 1 e Wave 2 para esta fase.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `TravelPreferenceService`: Já possui o método `updatePreferences`. Deve ser expandido para incluir a busca.
- `UserController`: Já possui a rota `PUT` implementada parcialmente. Deve ser expandida para incluir o `GET`.
- `StandardResponseDTO`: Refatorado recentemente para suportar detalhes de erro.

### Established Patterns
- **Interesses como String**: No banco, os interesses são armazenados como uma String separada por vírgulas. O Service deve lidar com a conversão de/para `List<String>`.

### Integration Points
- `UserController`: Ponto de entrada central para gestão de dados do usuário autenticado (`/api/v1/users/me/*`).

</code_context>

<specifics>
## Specific Ideas

- O usuário enfatizou a importância da idempotência do `PUT`.
- O foco é na simplicidade da resposta para o frontend (apenas a lista de strings).

</specifics>

<deferred>
## Deferred Ideas

- Algoritmo de recomendação baseado nos interesses (Sprint 3).
- Edição de preferências pós-onboarding (Futuro).

---

*Phase: 2-SDGEU-191 — Gestão de Preferências via API*
*Context gathered: 2026-05-09*
