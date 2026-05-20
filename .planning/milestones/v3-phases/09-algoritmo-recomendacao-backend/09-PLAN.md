# Phase 9: [SDGEU-223] Criar Algoritmo de Recomendação Baseado em Preferências (Backend)

## Objective
Implementar um algoritmo de recomendação inteligente baseado em preferências no backend (Spring Boot), permitindo que usuários recebam sugestões de atrações turísticas personalizadas e ordenadas com base no seu perfil, proximidade geográfica, popularidade e se o estabelecimento é parceiro.

## Context
O Exploraê permite ao usuário configurar suas preferências de viagem durante o onboarding (interesses específicos como `surf`, `trilhas`, `cafes`, etc.). Esta fase cria o cérebro de recomendações que lê esses interesses, cruza-os com a base de dados de atrações e gera um feed personalizado altamente engajador.

## Implementation Decisions
- **Fórmula de Score Adaptativa**: Combinação ponderada de 40% Perfil Híbrido, 30% Proximidade, 20% Popularidade e 10% Parceria.
- **Perfil Híbrido**: Composto por 70% preferências explícitas (onboarding) e 30% preferências implícitas baseadas em cliques recentes (últimas 20 visualizações de atrações registradas em banco).
- **Cálculo de Distância**: Fórmula de Haversine em Java para calcular a distância física em Km a partir de latitude e longitude informadas.
- **Paginação em Memória / Database**: Para o volume de dados do MVP (seeds controlados), as atrações podem ser carregadas na memória, pontuadas dinamicamente e paginadas usando uma sublista do Spring para máximo desempenho e flexibilidade.

## Proposed Changes

### Backend

#### [DOMAIN] UserInteraction (`backend/src/main/java/br/edu/ifpb/explorae/domain/attraction/UserInteraction.java`)
- Criar a entidade JPA `UserInteraction` com campos: `id` (UUID), `user` (`User`), `attraction` (`Attraction`), `interactionType` (String), e `createdAt` (LocalDateTime).

#### [REPOSITORY] UserInteractionRepository (`backend/src/main/java/br/edu/ifpb/explorae/repository/UserInteractionRepository.java`)
- Criar interface repository herdando de `JpaRepository<UserInteraction, UUID>`.
- Adicionar query method para buscar interações recentes de visualização ordenadas por data descendente limitadas a 20 registros:
  ```java
  List<UserInteraction> findTop20ByUserIdAndInteractionTypeOrderByCreatedAtDesc(UUID userId, String interactionType);
  ```

#### [DB] Liquibase Migration (`backend/src/main/resources/db/changelog/changes/017-create-user-interactions-table.xml`)
- Criar changeSet para criar a tabela `user_interactions` com as devidas constraints e chaves estrangeiras.
- Registrar a migration no arquivo `db.changelog-master.xml`.

#### [SERVICE] AttractionService (`backend/src/main/java/br/edu/ifpb/explorae/service/AttractionService.java`)
- Injetar `TravelPreferenceRepository` e `UserInteractionRepository`.
- No método `getAttractionDetails(...)`:
  - Se o usuário estiver autenticado (`principal != null`), registrar de forma assíncrona ou direta uma nova interação do tipo `'VIEW'` para a atração visualizada.
- Implementar o método `getRecommendations(User user, Double latitude, Double longitude, Pageable pageable)`:
  - Recuperar preferências explícitas do onboarding (`TravelPreference`).
  - Recuperar as últimas 20 visualizações de atração do usuário logado via `UserInteractionRepository`.
  - Agrupar e calcular a frequência relativa das categorias das atrações visualizadas recentemente (ex: se 4 visualizações foram "Praia" de um total de 20, a categoria "Praia" ganha um ScoreImplicito de `0.20`).
  - Calcular para cada atração da base o `MatchPerfilHibrido` combinando os scores explícito e implícito.
  * Mapear e calcular os fatores de distância (Haversine), popularidade (RatingNormalizado) e boost de parceiro.
  - Ordenar por score geral decrescente e retornar a fatia paginada.

#### [CONTROLLER] AttractionController (`backend/src/main/java/br/edu/ifpb/explorae/api/controller/AttractionController.java`)
- Adicionar o endpoint `@GetMapping("/recommendations")` com parâmetros `@RequestParam(required = false) Double latitude`, `@RequestParam(required = false) Double longitude` e `@AuthenticationPrincipal User principal`.

## Verification Plan

### Automated Tests
- Criar o teste de integração `/backend/src/test/java/br/edu/ifpb/explorae/integration/service/RecommendationIntegrationTest.java`:
  - Testar usuário sem preferências explicitas ou implícitas: retorna ordenação básica por popularidade (averageRating).
  - Testar correspondência explícita: validar que atrações de interesse do onboarding recebem pontuação superior.
  - Testar correspondência implícita (comportamento de cliques): simular visualizações recorrentes de uma determinada categoria (ex: "Histórico") e validar se atrações do tipo "Histórico" sobem no ranking de recomendações.
  - Testar com geolocalização: validar se atrações geograficamente próximas sobem no ranking de classificação.

### Manual Verification
- Iniciar o backend localmente.
- Logar com um usuário, realizar chamadas para visualizar detalhes de uma atração específica (`GET /api/v1/attractions/{id}`) repetidas vezes.
- Chamar o endpoint de recomendações (`GET /api/v1/attractions/recommendations`) e validar se a categoria da atração que foi visualizada subiu posições nos resultados recomendados.
