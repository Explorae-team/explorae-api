# Phase 8 Plan: Integração de Perfil (SDGEU-203)

## 🎯 Objetivo
Implementar a conexão real entre a UI de Perfil e o Backend, garantindo que XP, Nível e Medalhas reflitam o progresso real do usuário.

## 🏗️ Arquitetura
- **Hook**: `useAuth` para acesso global aos dados.
- **Service**: `userService.getUserProfile()` para atualizações "on-demand".
- **Componentes**: Refatorar componentes filhos para aceitar props dinâmicas.

## 🌊 Waves

### Wave 1: Integração Base & Loading
- [x] **T1**: Refatorar `src/app/dashboard/profile.tsx` para importar `useAuth`.
- [x] **T2**: Implementar lógica de `useEffect` para buscar perfil atualizado ao entrar na tela.
- [x] **T3**: Adicionar componente de Loading (ActivityIndicator) durante o fetch inicial.

### Wave 2: Mapeamento de Gamificação
- [x] **T1**: Atualizar `src/components/UserStats.tsx` para exibir `xp` e `level` reais.
- [x] **T2**: Implementar barra de progresso de XP dinâmica (fórmula: `xp / (level * 100)`).
- [x] **T3**: Atualizar `src/components/AchievementsList.tsx` para iterar sobre `user.badges`.

### Wave 3: Identidade Visual
- [x] **T1**: Conectar `ExplorerHeader` e avatar do perfil ao `photoUrl` do usuário.
- [x] **T2**: Exibir bio e nome real no topo da página.

### Wave 4: Métricas e Histórico
- [x] **T1**: Atualizar `src/components/StatsGrid.tsx` para exibir contador de ExploraCoins.
- [x] **T2**: Implementar histórico de XP real em `src/components/RecentActivity.tsx`.

## ✅ Verificação (UAT)
- [x] **UAT-01**: Ao abrir o perfil, o nome e bio exibidos são os mesmos cadastrados.
- [x] **UAT-02**: O nível e XP mostrados batem com os valores retornados pelo banco de dados.
- [x] **UAT-03**: As medalhas conquistadas (se houver) aparecem na lista de conquistas.
- [x] **UAT-04**: Se o usuário não tem foto, um ícone de placeholder elegante é exibido.

---
*Status: Concluído em 09 de maio de 2026*
