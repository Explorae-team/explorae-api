# Plan: Phase 2 (SDGEU-191)
Status: IN_PROGRESS
Progress: 50%

## Objective
Implementar a API REST para consulta e atualização das preferências de viagem do usuário autenticado.

## Context
A camada de persistência (Fase 1) já está pronta. Agora precisamos expor essa funcionalidade via Controller, garantindo que apenas o usuário autenticado possa acessar/editar suas próprias preferências.

## Tasks

### Wave 1: Camada de DTO & Service
- [x] **Task 1.1**: Criar `PreferenceResponseDTO` (interesses). (Implementado como `TravelPreferenceResponseDTO`)
- [x] **Task 1.2**: Criar `PreferenceRequestDTO` com Bean Validation. (Implementado como `TravelPreferenceRequestDTO`)
- [/] **Task 1.3**: Implementar `TravelPreferenceService`.
    - [ ] Método `findByUser(User user)`.
    - [x] Método `updatePreferences(UUID userId, TravelPreferenceRequestDTO dto)`. (Implementado)

### Wave 2: Controller & Security Integration
- [x] **Task 2.1**: Implementar `TravelPreferenceController`. (Implementado em `UserController`)
    - [ ] `GET /api/v1/users/me/preferences`. (Retornar apenas lista de interesses)
    - [x] `PUT /api/v1/users/me/preferences`. (Implementado)
- [x] **Task 2.2**: Integrar com `SecurityContext` para obter o `User` logado via JWT. (Concluído)
- [ ] **Task 2.3**: Padronizar tratamento de erros com `GlobalExceptionHandler` e `StandardResponseDTO`.

### Wave 3: Verificação & Testes
- [ ] **Task 3.1**: Criar `TravelPreferenceControllerTest` (MockMvc).
- [ ] **Task 3.2**: Validar respostas 200 OK, 401 Unauthorized e 400 Bad Request.

## Verification Plan
- [ ] Rodar testes de integração da API.
- [ ] Validar via cURL/Postman os endpoints com token JWT.
