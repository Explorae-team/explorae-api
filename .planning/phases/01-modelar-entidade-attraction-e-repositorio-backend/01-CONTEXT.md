# Phase 1: [SDGEU-209] Modelar Entidade Attraction e Repositório - Context

**Gathered:** 2026-05-10
**Status:** Ready for planning
**Source:** Jira Sprint 3 Export & Technical Analysis

<domain>
## Phase Boundary
Esta fase foca exclusivamente na estrutura de dados do backend para Atrações. O objetivo é garantir que todos os campos necessários para o Feed (Phase 5) e Detalhes (Phase 12) estejam presentes no banco e na entidade JPA.

</domain>

<decisions>
## Implementation Decisions

### Entity Structure
- **ID**: UUID (Padrão do projeto).
- **Atributos Existentes**: name, category, shortDescription, longDescription, latitude, longitude, openingHours, priceRange, averageRating.
- **Novos Atributos**:
  - `address`: String para exibir a localização legível.
  - `images`: Lista de strings para armazenar as URLs das fotos (via @ElementCollection).

### Database
- **Liquibase**: Usar UUID para chaves estrangeiras na tabela de imagens.
- **Tabela Auxiliar**: `attraction_images` para manter o relacionamento 1:N de forma simples.

### Discretion
- **Preço**: Mantido como `priceRange` (Integer) conforme modelagem inicial, por ser mais adequado para um MVP de guia turístico.
- **Categorias**: Mantidas como String para compatibilidade com os `interests` do usuário.

</decisions>

<canonical_refs>
## Canonical References
- `backend/src/main/java/br/edu/ifpb/explorae/domain/attraction/Attraction.java` — Entidade base.
- `backend/src/main/resources/db/changelog/changes/004-create-attractions-table.xml` — Esquema inicial.

</canonical_refs>

---
*Phase: 01-modelar-entidade-attraction-e-repositorio-backend*
