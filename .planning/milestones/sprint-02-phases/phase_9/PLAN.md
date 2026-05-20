# Plan: Phase 9 — Expansão do Perfil & Editabilidade

Esta fase implementa a identidade visual dinâmica baseada em XP e o fluxo de edição in-line do perfil.

## Wave 1: Identidade Visual Dinâmica
Foco: Implementar tiers de nível no backend e refletir as cores/nomes no frontend.

- [x] **Task 1: Backend - Atualizar DTO e Lógica de Nível**
    - Adicionar `levelName` ao `UserResponseDTO`.
    - Implementar `calculateLevelName(Integer xp)` no `UserMapper` ou `UserService`.
    - Lógica: 0-999 "Explorador Bronze", 1000-1999 "Explorador Prata", 2000-2999 "Explorador Ouro", 3000+ "Explorador Platina".
- [x] **Task 2: Frontend - Exibição do Nome do Nível**
    - Atualizar `UserStats.tsx` para exibir o `user.levelName` vindo da API.
- [x] **Task 3: Frontend - Bordas de Avatar por Tier**
    - Criar utilitário `getTierColor(xp)` no frontend.
    - Aplicar cor dinâmica na borda do Avatar no `UserStats.tsx`.
    - Cores: Bronze (#CD7F32), Silver (#C0C0C0), Gold (#FFD700), Turquoise (#40E0D0).

## Wave 2: Edição Direta (In-line)
Foco: Habilitar edição de Nome e Bio diretamente no Perfil.

- [x] **Task 1: Frontend - Modo de Edição In-line**
    - Adicionar estado `isEditing` no `ExplorerProfile` ou `UserStats`.
    - Alternar entre `Text` e `TextInput` para Nome e Bio.
    - Implementar botão "Salvar" e "Cancelar".
- [x] **Task 2: Frontend - Integração com API de Update**
    - Chamar `PUT /api/v1/users/me` com os novos dados.
    - Validar limite de 150 caracteres na Bio.
- [x] **Task 3: Frontend - Upload de Avatar**
    - Instalar/Configurar `expo-image-picker`.
    - Implementar `handleSelectImage` no `UserStats`.
    - Chamar `POST /api/v1/users/me/avatar`.

## Wave 3: Enriquecimento de Stats
Foco: Tornar os cards informativos mais completos.

- [x] **Task 1: Frontend - Detalhamento de Stats**
    - Adicionar contexto visual aos cards de Coins e Quests no `StatsGrid.tsx`.

## Verification Plan

### Automated Tests
- [ ] **Backend:** Testar se o `UserResponseDTO` retorna o `levelName` correto para diferentes faixas de XP.
- [ ] **Frontend:** Verificar se a cor da borda do avatar muda conforme o XP simulado.

### Manual Verification (UAT)
1. Fazer login e verificar se o nome do nível aparece no perfil.
2. Clicar em "Editar" (ou no campo) e alterar o nome/bio.
3. Tentar digitar mais de 150 caracteres na bio e verificar a trava.
4. Salvar e verificar se os dados persistem após refresh.
5. Selecionar uma foto da galeria e verificar o upload.
