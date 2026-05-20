# Phase 10 Plan: Central de Configurações & Preferências

Esta fase foca na implementação da tela de configurações, permitindo a gestão da conta e a reedição de preferências.

## User Review Required

> [!IMPORTANT]
> A exclusão de conta será um mock no frontend (exibindo um diálogo de confirmação) até que o endpoint de exclusão seja implementado no backend em uma fase futura, ou implementaremos agora? (Seguirei com Mock para foco na UI, conforme protótipo).

---

## Proposed Changes

### 🏗️ Estrutura de Componentes (Frontend)
#### [NEW] `frontend/src/components/SettingsItem.tsx`
- Componente reutilizável para cada linha de configuração.
- Props: `icon`, `title`, `description`, `onPress`, `showChevron`.

#### [NEW] `frontend/src/components/SettingsGroup.tsx`
- Container arredondado para agrupar `SettingsItem`.

#### [NEW] `frontend/src/app/settings.tsx`
- Nova tela de configurações baseada no protótipo HTML.
- Implementar grupos: Experiência, Privacidade, Segurança.

### 🔄 Atualizações de Navegação
#### `frontend/src/app/dashboard/profile.tsx` (ou equivalente)
- Adicionar ícone de engrenagem no cabeçalho para navegar até `/settings`.

#### `frontend/src/app/preferences.tsx`
- Adicionar suporte a `editMode`.
- Se `editMode` for true, o botão final deve dizer "Salvar Alterações" e fazer `router.back()` após o sucesso.

### 🚪 Lógica de Sessão
- Implementar função `handleLogout` no `settings.tsx` utilizando o `AuthContext`.

---

## Verification Plan

### Automated Tests
- N/A para esta fase de UI inicial (validação manual via Expo).

### Manual Verification (UAT)
1. **Acesso**: Clicar na engrenagem no Perfil -> Abrir tela de Configurações.
2. **Navegação**: Botão voltar deve retornar ao Perfil.
3. **Re-onboarding**: Clicar em "Preferências de Viagem" -> Abrir tela de preferências -> Alterar interesses -> Salvar -> Voltar para Configurações com sucesso.
4. **Logout**: Clicar em "Sair da Conta" -> Limpar sessão -> Redirecionar para Login.
5. **Visual**: Comparar com o protótipo HTML (bordas, cores, espaçamentos).
