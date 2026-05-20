# Context - Phase 4: API de Listagem de Atrações com Paginação

## 🎯 Phase Goal
Implementar o endpoint de listagem de atrações no backend para alimentar o feed do aplicativo. O endpoint deve suportar paginação para garantir performance e escalabilidade.

## 📄 Requirements Analysis
- **Endpoint**: `GET /api/v1/attractions`.
- **Paginação**: Suporte aos parâmetros `page` e `size`.
- **Response**: Lista paginada de atrações envolvida no `StandardResponseDTO`.
- **Segurança**: O endpoint deve ser público para permitir a visualização inicial do feed sem login (opcional, mas recomendado para o "Explore").

## 🧩 Architectural Decisions
- **DTOs**: Uso de `AttractionResponseDTO` para desacoplar a entidade da API.
- **Service**: Implementar `AttractionService` para centralizar a lógica de busca.
- **Spring Data JPA**: Uso de `Pageable` para facilitar a paginação no banco de dados.

## ⚠️ Risks & Mitigation
- **N+1 Problem**: Atenção ao carregar a coleção de imagens (`attraction_images`). Usar `EntityGraph` ou `JOIN FETCH` se necessário.
- **Segurança**: Garantir que apenas dados públicos sejam expostos.
