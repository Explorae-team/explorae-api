# Phase 8 Context: Integração de Perfil (SDGEU-203)

## 🎯 Escopo
Transformar a tela de perfil estática em uma interface dinâmica integrada ao backend.

## 🛠️ Decisões Técnicas

### 1. Gestão de Dados
- **Fonte de Dados**: O `AuthContext` será a fonte primária. Ele já possui o objeto `user` que contém os dados básicos e de gamificação (XP, Level, Badges).
- **Sincronização**: Sempre que a tela de perfil for focada, faremos uma chamada silenciosa para `/api/v1/users/me` para garantir que o XP/Level estejam atualizados (caso o usuário tenha ganho XP em outra tela).

### 2. Mapeamento de UI
- **UserStats**: Receberá `xp` e `level`.
- **InterestsGrid (StatsGrid)**: Poderá exibir contadores baseados nas preferências.
- **AchievementsList**: Mapeará o array `badges` (Medalhas) para os ícones correspondentes.
- **Avatar**: Usar o `photoUrl` do usuário, com um fallback de ícone padrão se for nulo.

### 3. UX & Loading
- **Estado Inicial**: Enquanto o primeiro carregamento do perfil (`/me`) acontece, exibir um `ActivityIndicator` centralizado.
- **Fallback**: Se o servidor falhar, exibir os dados cacheados no `AuthContext` (se disponíveis).

## 🚫 Fora de Escopo
- Edição de perfil nesta fase (foco apenas em exibição/leitura).
- Upload de nova foto (Fase 6).

---
*Decidido em: 09 de maio de 2026*
