# Phase 9: [SDGEU-223] Criar Algoritmo de Recomendação Baseado em Preferências - Context

**Gathered:** 2026-05-19
**Status:** Ready for planning
**Source:** Jira Sprint 3, PRD Turismo Gamificado & Database Analysis

<domain>
## Phase Boundary
Esta fase foca na criação e exposição do endpoint de recomendações personalizadas no backend (Spring Boot). O objetivo é cruzar as preferências de viagem do usuário logado com o catálogo de atrações para gerar uma lista de sugestões ordenada por relevância.

</domain>

<decisions>
## Implementation Decisions

### API Endpoint
- **Rota**: `GET /api/v1/attractions/recommendations`
- **Segurança**: Apenas usuários autenticados (JWT).
- **Parâmetros**: `latitude` (Double, opcional), `longitude` (Double, opcional) e paginação padrão (`Pageable`).
- **Resposta**: `StandardResponseDTO<Page<AttractionResponseDTO>>`.

### Algoritmo de Recomendação Adaptativo (v1.1)
A pontuação de cada atração é calculada com base na seguinte fórmula ponderada:
$$Score = (0.40 \times MatchPerfilHibrido) + (0.30 \times FatorDistancia) + (0.20 \times RatingNormalizado) + (0.10 \times BoostParceiro)$$

* **MatchPerfilHibrido (0.0 a 1.0)**:
  * Desenvolvido para adaptar as recomendações ao comportamento do usuário conforme ele utiliza a aplicação, combinando preferências explícitas (onboarding) com implícitas (interações recentes).
  * $$MatchPerfilHibrido = (0.70 \times ScoreExplicito) + (0.30 \times ScoreImplicito)$$
  * **ScoreExplicito (0.0 a 1.0)**:
    * `1.0` se a atração corresponder diretamente a um interesse detalhado selecionado pelo usuário no onboarding (slug correspondente).
    * `0.5` se a atração corresponder indiretamente (via mapeamento de parent_category como "cultura" -> "Cultura", "aventura" -> "Natureza").
    * `0.0` se não houver match.
  * **ScoreImplicito (0.0 a 1.0)**:
    * Registramos visualizações de detalhes de atrações na tabela `user_interactions` sempre que `GET /api/v1/attractions/{id}` é acessado por um usuário autenticado.
    * Calculamos a fração de cliques recentes (últimos 20 cliques de visualização do usuário) pertencentes à categoria daquela atração específica. Se o usuário visualizou 5 atrações da categoria "Praia" de um total de 20 cliques recentes, o ScoreImplicito para qualquer atração da categoria "Praia" será `5 / 20 = 0.25`.
    * Caso o usuário não possua interações registradas, o ScoreImplicito padrão é `0.5`.

* **FatorDistancia (0.0 a 1.0)**:
  * Calculado se `latitude` e `longitude` forem passados na requisição (usando a fórmula de Haversine).
  * Fórmula de decaimento: $1.0 / (1.0 + DistanciaEmKm)$.
  * Se coordenadas não forem passadas, assume `1.0` (sem penalidade de distância).
* **RatingNormalizado (0.0 a 1.0)**:
  * $averageRating / 5.0$.
* **BoostParceiro (0.0 ou 1.0)**:
  * `1.0` se a atração for parceira oficial (`isPartner = true`), `0.0` caso contrário.

### Rastreamento de Interações
- Criar a entidade JPA `UserInteraction` (`br.edu.ifpb.explorae.domain.attraction.UserInteraction`):
  - `id`: UUID (Chave primária).
  - `user`: `@ManyToOne User` (Usuário que interagiu).
  - `attraction`: `@ManyToOne Attraction` (Atração visualizada).
  - `interactionType`: String (Padrão `'VIEW'`).
  - `createdAt`: LocalDateTime (Data e hora da interação).
- Adicionar migration do Liquibase para criar a tabela `user_interactions`.

### Mapeamento Categoria-Atração
Mapeamento lógico das categorias detalhadas da preferência do usuário para a categoria geral da atração:
- `parent_category = 'cultura'` -> `Cultura`, `Histórico`
- `parent_category = 'aventura'` -> `Natureza`, `Praia`, `Lazer`
- `parent_category = 'relaxamento'` -> `Natureza`, `Praia`, `Lazer`
- `parent_category = 'gastronomia'` -> `Lazer`
- `parent_category = 'noite'` -> `Lazer`, `Cultura`

</decisions>

<canonical_refs>
## Canonical References
- `backend/src/main/java/br/edu/ifpb/explorae/domain/attraction/Attraction.java` — Entidade atração.
- `backend/src/main/java/br/edu/ifpb/explorae/domain/user/TravelPreference.java` — Entidade de preferências do usuário.
- `backend/src/main/java/br/edu/ifpb/explorae/service/TravelPreferenceService.java` — Serviço de consulta de preferências.
- `backend/src/main/java/br/edu/ifpb/explorae/api/controller/AttractionController.java` — Controller onde o novo endpoint será adicionado.
- `backend/src/main/java/br/edu/ifpb/explorae/domain/attraction/UserInteraction.java` — Nova entidade de rastreamento de interações implícitas.
- `backend/src/main/resources/db/changelog/changes/017-create-user-interactions-table.xml` — Nova migration Liquibase.

</canonical_refs>

---
*Phase: 09-algoritmo-recomendacao-backend*
