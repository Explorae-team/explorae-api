# Phase 11: Refatoração de Arquitetura do Backend para Package-by-Feature

## Goal
Aderir ao princípio SOLID (SRP e ISP) organizando a arquitetura do backend em fatias verticais por domínio.

## Context
O projeto apresenta pastas globais de `repository` e `service` na raiz do módulo `explorae/` que violam as regras de domínio coeso, pois expõem serviços de domínios variados no mesmo pacote. A verificação detectou que os arquivos principais já haviam sido migrados, restando apenas `.gitkeep` nesses pacotes globais vazios.

## Proposed Implementation
1. Remover pastas vazias `backend/src/main/java/br/edu/ifpb/explorae/repository` e `backend/src/main/java/br/edu/ifpb/explorae/service`.
2. Assegurar que nenhum código está quebrado executando o build e testes do Maven.

## Tasks
- [x] Exclusão das pastas globais vazias.
- [x] Atualização do `ROADMAP.md` para inclusão da Phase 11.
- [x] Compilação do Maven para validação.
