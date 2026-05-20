# Requirements - Sprint 03 (Archived Milestone)

## Overview
A Sprint 03 focou na entrega do catálogo de atrações, feed principal, filtros e recomendações personalizadas, permitindo que o usuário explore o conteúdo principal do app Exploraê.

## User Stories

### [SDGEU-154] Feed de Atrações
**Descrição**: Como um explorador, desejo visualizar uma lista de atrações turísticas para que eu possa escolher onde ir.

- **Requisitos Funcionais**:
  - [X] Modelagem da entidade `Attraction` no backend (nome, descrição, categoria, preço, avaliação, imagens).
  - [X] População inicial do banco via Liquibase.
  - [X] API de listagem com suporte a paginação.
  - [X] Feed no frontend com Infinite Scroll.
  - [X] Card de atração visualmente atraente.
- **Critérios de Aceite**:
  - [X] O feed deve carregar novas atrações ao chegar no fim da lista.
  - [X] Cada card deve exibir imagem, nome, categoria e média de avaliação.

### [SDGEU-155] Filtros de Atrações
**Descrição**: Como um explorador, desejo filtrar as atrações por categoria, preço e avaliação para encontrar o que mais me interessa.

- **Requisitos Funcionais**:
  - [X] Filtros dinâmicos na API (Criteria API).
  - [X] Ordenação por menor/maior preço e melhor avaliação.
  - [X] Interface de seleção de filtros no mobile.
- **Critérios de Aceite**:
  - [X] A lista deve atualizar instantaneamente ao aplicar um filtro.
  - [X] Deve ser possível limpar todos os filtros aplicados.

### [SDGEU-156] Recomendações Inteligentes
**Descrição**: Como um explorador, desejo receber sugestões personalizadas baseadas no meu perfil para economizar tempo na busca.

- **Requisitos Funcionais**:
  - [X] Algoritmo no backend que cruza as preferências do usuário (`TravelPreference`) com as categorias das atrações.
  - [X] Carrossel de "Destaques para você" no topo do feed.
- **Critérios de Aceite**:
  - [X] Usuários com preferência "Natureza" devem ver atrações dessa categoria no topo das recomendações.

### [SDGEU-157] Detalhes da Atração
**Descrição**: Como um explorador, desejo ver informações detalhadas de uma atração para planejar minha visita.

- **Requisitos Funcionais**:
  - [X] Endpoint para recuperar detalhes completos de uma atração por ID.
  - [X] Tela de detalhes com galeria de imagens (Carousel), descrição longa, mapa (estático) e avaliações.
- **Critérios de Aceite**:
  - [X] A galeria de fotos deve suportar navegação horizontal.
  - [X] Todas as informações básicas devem estar visíveis sem travamentos.
