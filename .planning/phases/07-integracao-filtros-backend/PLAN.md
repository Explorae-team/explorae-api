# PLAN - Phase 7: [SDGEU-376] Integrar Filtros com o Backend

Este plano foca na integração das funcionalidades de busca e filtragem da interface com a API real, permitindo que o usuário encontre atrações com base em texto, categorias e critérios técnicos (preço, avaliação, etc).

## 📝 Objetivos
1. Implementar suporte a filtros no endpoint de listagem de atrações (Backend).
2. Atualizar o hook `useExploreData` para enviar parâmetros de filtro (Frontend).
3. Conectar a tela de `SearchScreen` ao fluxo de dados real.

---

## 📅 Etapas de Execução

### Etapa 1: Backend - Suporte a Filtros Dinâmicos
- [X] Adicionar suporte a `JpaSpecificationExecutor` no `AttractionRepository`.
- [X] Criar `AttractionFiltersDTO` para capturar parâmetros (name, category, priceRange, minRating).
- [X] Implementar `AttractionSpecification` para construir queries dinâmicas.
- [X] Atualizar `AttractionService` e `AttractionController` para aceitar os filtros.

### Etapa 2: Frontend - Evolução do useExploreData
- [X] Modificar o hook `useExploreData.ts` para aceitar um objeto `filters`.
- [X] Adicionar `filters` como dependência no `useEffect` do hook para disparar novas buscas.
- [X] Implementar debouncing no campo de busca textual para evitar chamadas excessivas.

### Etapa 3: Integração na Tela de Busca
- [X] Conectar os estados locais de `SearchScreen.tsx` ao hook `useExploreData`.
- [X] Exibir os resultados reais retornados pela API na lista.
- [X] Mostrar estados de "Carregando" e "Nenhum resultado encontrado".

---

## 🧪 Critérios de Aceite (UAT)
1. Ao digitar na barra de busca, os resultados são filtrados por nome (com debounce).
2. Ao selecionar uma categoria, os resultados mostram apenas atrações daquele tipo.
3. Ao aplicar filtros de preço ou avaliação no modal, a lista é atualizada.
4. A paginação continua funcionando corretamente junto com os filtros ativos.

---

## ⚠️ Riscos e Dependências
- **Desempenho**: Queries dinâmicas complexas podem ser lentas sem índices adequados.
- **Sincronia**: Garantir que as categorias enviadas pelo front correspondam aos valores salvos no banco (Enums ou Strings).
