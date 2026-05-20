---
status: testing
phase: 09-algoritmo-recomendacao-backend
source: [09-01-SUMMARY.md]
started: 2026-05-19T22:58:00Z
updated: 2026-05-19T22:58:00Z
---

## Teste Atual

número: 4
nome: Ranking Híbrido (Feed Adaptativo)
esperado: |
  Ao chamar a rota de recomendações, as atrações que combinam com os interesses explícitos do usuário e suas categorias recentemente visualizadas aparecem no topo da lista, validando a priorização do algoritmo.
resultado: [pass]

## Testes

### 1. Teste de Inicialização a Frio
esperado: Interromper qualquer servidor/serviço em execução. Limpar estado efêmero. Iniciar a aplicação do zero. O servidor deve iniciar sem erros, a migração 017 deve ser aplicada com sucesso, e uma verificação de saúde da API deve retornar dados ao vivo.
resultado: [pass]

### 2. Acesso à Rota de Recomendações
esperado: O cliente autenticado realiza um GET em `/api/v1/attractions/recommendations`. A API retorna status HTTP 200 e um StandardResponseDTO contendo uma página de atrações (page).
resultado: [pass]

### 3. Rastreamento Implícito (View)
esperado: O cliente autenticado acessa os detalhes de uma atração (`GET /api/v1/attractions/{id}`). Um registro é criado na tabela `user_interactions` com o tipo `VIEW` associado a este usuário e atração.
resultado: [pass]

### 4. Ranking Híbrido (Feed Adaptativo)
esperado: Ao chamar a rota de recomendações, as atrações que combinam com os interesses explícitos do usuário e suas categorias recentemente visualizadas aparecem no topo da lista, validando a priorização do algoritmo.
resultado: [pass]

## Resumo

total: 4
passados: 4
issues: 0
pendentes: 0
ignorados: 0

## Lacunas

