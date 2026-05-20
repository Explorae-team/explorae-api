# Phase 3 Plan: UI Onboarding (SDGEU-193)

## 🎯 Goal
Implementar o fluxo visual de Onboarding para coleta de preferências turísticas, incluindo a lógica de redirecionamento automático e integração com a API.

## 🏗️ Architecture & Decisions
- **Redirecionamento**: Baseado no campo `hasPreferences` do `UserResponseDTO`.
- **UI**: Grid de seleção única em tela cheia, usando NativeWind para estilização.
- **Estado**: Gerenciado localmente na tela de onboarding antes de submeter ao backend via `AuthContext` ou serviço dedicado.

## 🌊 Waves

### Wave 1: Lógica de Navegação & Contexto
- [x] **T1**: Atualizar `AuthContext.jsx` para garantir que o estado do usuário reflita mudanças nas preferências.
- [x] **T2**: Atualizar `_layout.jsx` para incluir a regra de redirecionamento:
    - Se `isAuthenticated` AND `!user.hasPreferences` AND `segments[0] !== 'preferences'` -> Redirect to `/preferences`.
- [x] **T3**: Criar a rota `app/preferences.tsx` (esqueleto inicial).

### Wave 2: Recuperação de Design & Componentização (Stitch)
- [x] **T1**: Recuperar design da tela "Interesses (Final)" via Stitch (ID: `5bfcbe6417a74013974160a577127cda`).
- [x] **T2**: Identificar e extrair componentes reutilizáveis do design (ex: `InterestCard`, `SubmitButton`).
- [x] **T3**: Criar/Atualizar `src/components/preferences/InterestCard.tsx` baseado no design do Stitch.
- [x] **T4**: Criar `src/components/preferences/InterestsGrid.tsx` para gerenciar a seleção múltipla.

### Wave 3: Implementação da Tela & Integração
- [x] **T1**: Implementar `app/preferences.tsx` integrando o design do Stitch e os componentes.
- [x] **T2**: Criar serviço `src/services/preferenceService.ts` para chamada ao endpoint `PUT /api/v1/users/me/preferences`.
- [x] **T3**: Adicionar feedback visual (Loading e Toast/Alert) durante a gravação.

### Wave 4: Polimento & Verificação
- [x] **T1**: Validar fluxo completo: Cadastro -> Preferences -> Dashboard.
- [x] **T2**: Validar persistência: Login com usuário que já possui preferências não deve ver a tela de preferences.
- [x] **T3**: Ajustes de estilo (NativeWind) para garantir responsividade em diferentes tamanhos de tela.

## ✅ Verification (UAT)
- **UAT-01**: O usuário recém-cadastrado é redirecionado automaticamente para a tela `/preferences`.
- **UAT-02**: A tela de interesses exibe o design fiel ao Stitch com seleção múltipla.
- **UAT-03**: Ao clicar em "Finalizar", os dados são salvos no backend e o usuário é levado ao Dashboard.
- **UAT-04**: Usuários que já completaram as preferências não são redirecionados ao fazer login.
