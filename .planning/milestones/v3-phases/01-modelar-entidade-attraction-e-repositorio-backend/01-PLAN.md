# Phase 1: [SDGEU-209] Modelar Entidade Attraction e Repositório (Backend)

## Objective
Finalizar a modelagem da entidade `Attraction` no backend, adicionando campos essenciais para o funcionamento do feed e detalhes da atração, além de garantir a persistência correta no banco de dados.

## Context
A entidade `Attraction` e o `AttractionRepository` já existem como stubs básicos. Precisamos estender a modelagem para incluir suporte a múltiplas imagens e o endereço completo da atração, conforme os requisitos da Sprint 03.

## Implementation Decisions
- **Endereço**: Adicionar campo `address` (String) para exibição na tela de detalhes.
- **Imagens**: Utilizar `@ElementCollection` com uma tabela auxiliar `attraction_images` para armazenar as URLs das imagens. Isso permite flexibilidade sem a complexidade de uma entidade separada para imagens neste momento.
- **Migração**: Criar um novo changelog no Liquibase para aplicar as alterações de esquema.

## Proposed Changes

### Backend

#### [DOMAIN] Attraction (`backend/src/main/java/br/edu/ifpb/explorae/domain/attraction/Attraction.java`)
- Adicionar campo `private String address;`.
- Adicionar campo `private List<String> images;` com anotações `@ElementCollection`, `@CollectionTable` e `@Column(name = "image_url")`.

#### [DB] Liquibase (`backend/src/main/resources/db/changelog/changes/009-add-address-and-images-to-attractions.xml`)
- Criar `changeSet` para adicionar coluna `address` na tabela `attractions`.
- Criar `changeSet` para criar a tabela `attraction_images` com colunas `attraction_id` (UUID) e `image_url` (VARCHAR).

#### [DB] Liquibase Master (`backend/src/main/resources/db/changelog/db.changelog-master.xml`)
- Incluir o novo arquivo de changelog.

## Verification Plan

### Automated Tests
- Criar teste de integração `AttractionPersistenceTest` para validar:
  - Persistência de uma atração com múltiplos endereços e imagens.
  - Recuperação correta dos dados.
  - Cascateamento da remoção (ao excluir atração, imagens devem sumir).

### Manual Verification
- Verificar se as tabelas foram criadas corretamente no banco de dados (H2 em modo dev).
- Validar se o log do Spring Boot mostra o Liquibase executando as novas migrations.
