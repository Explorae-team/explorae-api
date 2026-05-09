# Phase 2: SDGEU-191 — Gestão de Preferências via API - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-05-09
**Phase:** 2-SDGEU-191 — Gestão de Preferências via API
**Areas discussed:** Método HTTP, Estrutura da Resposta, Localização dos Endpoints, Tratamento de Erros, Padrão de Resposta

---

## Método HTTP para Salvar Preferências

| Option | Description | Selected |
|--------|-------------|----------|
| POST | Seguir estritamente o REQUIREMENTS.md original | |
| PUT | Usar PUT por ser idempotente e semântica de substituição | ✓ |

**User's choice:** PUT.
**Notes:** O usuário decidiu manter o PUT pela idempotência e solicitou a atualização do REQUIREMENTS.md.

---

## Estrutura da Resposta (GET)

| Option | Description | Selected |
|--------|-------------|----------|
| Objeto Completo | Retornar ID da preferência, ID do usuário e interesses | |
| Apenas Preferências | Retornar apenas a lista de interesses `["A", "B"]` | ✓ |

**User's choice:** Apenas as preferências.
**Notes:** Foco em manter o contrato simples para o consumo do frontend.

---

## Localização dos Endpoints

| Option | Description | Selected |
|--------|-------------|----------|
| /users/me/preferences | Seguir o PLAN.md original | |
| /api/v1/users/me/preferences | Seguir o padrão do projeto com prefixo de versão | ✓ |

**User's choice:** Seguir o padrão do projeto (`/api/v1`).
**Notes:** O usuário solicitou que o PLAN.md fosse atualizado para refletir o padrão do projeto.

---

## Tratamento de Erros e Padrão de Resposta

| Option | Description | Selected |
|--------|-------------|----------|
| RuntimeException | Comportamento atual (serviço lança exceção genérica) | |
| GlobalExceptionHandler | Padronizar com ControllerAdvice e StandardResponseDTO | ✓ |

**User's choice:** Padronizar usando GlobalExceptionHandler e StandardResponseDTO.
**Notes:** O usuário atualizou o `StandardResponseDTO` durante a discussão para suportar melhor o reporte de erros.

---

## Deferred Ideas

- Algoritmo de recomendação (Sprint 3).
- Edição de preferências em outros contextos (Futuro).
