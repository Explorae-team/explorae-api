# Phase 5 Plan: Gamificação (XP e Níveis)

## 🎯 Objetivo
Implementar o motor de gamificação do Exploraê, permitindo que usuários ganhem XP, subam de nível e conquistem medalhas através de suas ações no app.

## 🏗️ Arquitetura
- **Events**: Padrão Observer com Spring Application Events.
- **Service**: `GamificationService` para processar lógica de negócio.
- **Storage**: `LocalFileStorageService` para gerenciar ícones de medalhas.

## 🌊 Waves

### Wave 1: Infraestrutura de Gamificação
- [x] **T1**: Criar classes de eventos (ex: `GamificationEvent`, `XpEarnedEvent`).
- [x] **T2**: Implementar `GamificationService` com métodos `addXp` e `awardBadge`.
- [x] **T3**: Criar `GamificationListener` para reagir aos eventos disparados.

### Wave 2: Gerenciamento de Medalhas (Badges) & Storage
- [x] **T1**: Implementar `LocalFileStorageService` para servir imagens locais via HTTP.
- [x] **T2**: Criar script SQL/Migration para popular as medalhas iniciais (`PIONEIRO`, `DESBRAVADOR`, etc).
- [x] **T3**: Atualizar `UserMapper` e `UserResponseDTO` para incluir a lista de medalhas conquistadas.

### Wave 3: Gatilhos e Integração
- [x] **T1**: Disparar evento de XP ao concluir o Onboarding de Preferências.
- [x] **T2**: Implementar endpoint (ou integrar em `/me`) para retornar histórico de XP recente.
- [x] **T3**: Testes de integração garantindo que o XP acumula e o Nível sobe corretamente.

## ✅ Verificação (UAT)
- [x] **UAT-01**: Após salvar preferências, o usuário deve estar no Nível 2 (100 XP).
- [x] **UAT-02**: O banco de dados deve registrar uma entrada na tabela `xp_history` para cada ganho.
- [x] **UAT-03**: Ao conquistar uma medalha, ela deve aparecer no array `badges` do `UserResponseDTO`.
- [x] **UAT-04**: As URLs das imagens das medalhas devem ser acessíveis pelo navegador/mobile.

---
*Plano concluído em: 09 de maio de 2026*
