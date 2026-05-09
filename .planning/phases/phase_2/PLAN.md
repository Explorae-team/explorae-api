# Plan: Phase 2 (SDGEU-191)
Status: IN_PROGRESS
Progress: 60%

## Objective
Finalizar a API REST para consulta e atualização das preferências de viagem do usuário autenticado, seguindo os padrões de arquitetura do projeto (v1 prefix, GlobalExceptionHandler, StandardResponseDTO).

## Context
A persistência e parte da lógica de atualização já foram implementadas. O foco agora é na padronização da API, implementação do endpoint de consulta e robustez no tratamento de erros para integração com o Mobile (Expo).

## Tasks

### Wave 1: Refatoração & Padronização (Foundational)
- [x] **Task 1.1**: Refatorar `StandardResponseDTO` para suportar campo `errors` e `@JsonInclude(NON_NULL)`. (Concluído)
- [x] **Task 1.2**: Verificar e garantir que `GlobalExceptionHandler` intercepta exceções comuns (`MethodArgumentNotValidException`, `BusinessException`, etc) e retorna `StandardResponseDTO`. (Concluído)
- [ ] **Task 1.3**: Revisar `UserController` para garantir que todos os métodos utilizam `StandardResponseDTO.success()` ou `.error()`.

### Wave 2: Finalização da API de Preferências
- [ ] **Task 2.1**: Implementar método `getPreferences(UUID userId)` em `TravelPreferenceService`.
    - Deve buscar a entidade e converter a String de interesses em `List<String>`.
- [ ] **Task 2.2**: Implementar `GET /api/v1/users/me/preferences` em `UserController`.
    - Retorno esperado: `StandardResponseDTO<List<String>>`.
- [x] **Task 2.3**: Validar rota `PUT /api/v1/users/me/preferences`. (Implementada, revisar se segue o padrão v1 e DTO padrão)

### Wave 3: Verificação & Testes (Quality Gate)
- [ ] **Task 3.1**: Criar `TravelPreferenceApiTest` (ou expandir `UserControllerTest`).
    - Validar `GET` e `PUT` com sucesso (200).
    - Validar erro de validação no `PUT` (400) via `GlobalExceptionHandler`.
    - Validar acesso não autorizado (401).
- [ ] **Task 3.2**: Gerar `SUMMARY.md` da fase após verificação.

## Verification Plan
- [ ] Execução de testes unitários e de integração (`mvn test`).
- [ ] Teste manual de integração via cURL garantindo o prefixo `/api/v1`.
- [ ] Validação da estrutura JSON no campo `errors` em caso de falha de validação.
