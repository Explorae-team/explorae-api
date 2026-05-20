# Phase 9 Context: Expansão do Perfil & Editabilidade

## Overview
Esta fase foca em transformar o perfil do usuário em uma interface dinâmica e editável, enriquecendo a identidade visual baseada no progresso (XP) e permitindo a atualização de dados pessoais diretamente na interface.

## Implementation Decisions

### 📊 Gamificação & Identidade Visual
- **Tiers de Nível (Baseado em XP Total):**
    - **Bronze (Explorador Bronze):** 0 - 999 XP. Cor da borda: Cobre (`#CD7F32`).
    - **Prata (Explorador Prata):** 1000 - 1999 XP. Cor da borda: Prata/Cinza (`#C0C0C0`).
    - **Ouro (Explorador Ouro):** 2000 - 2999 XP. Cor da borda: Ouro (`#FFD700`).
    - **Platina (Explorador Platina):** 3000+ XP. Cor da borda: Turquesa (`#40E0D0`).
- **Origem dos Dados:** O nome do nível (ex: "Explorador Bronze") deve ser calculado no Backend e retornado no campo `levelName` do `UserResponseDTO`.

### ✏️ Edição de Perfil
- **Fluxo:** Edição **In-line** diretamente na tela de perfil.
- **Campos:**
    - **Nome:** Editável com feedback instantâneo.
    - **Bio:** Limite de **150 caracteres** (trava visual e no backend).
- **Upload de Foto:**
    - **Método:** Integração com Câmera e Galeria (Padrão de mercado).
    - **Plataformas:** Compatível com Mobile (Expo) e Web.

### 🃏 Cards de Estatísticas
- **Interatividade:** Os cards de **ExploraCoins** e **Quests** serão **estáticos/informativos** por enquanto.
- **Conteúdo:** Devem exibir o saldo atual e status geral sem navegação para sub-telas nesta fase.

## Technical Alignment
- **Backend:** 
    - Atualizar `UserResponseDTO` para incluir `levelName`.
    - Implementar lógica de cálculo de tier no `UserService` ou `UserMapper`.
- **Frontend:**
    - Implementar modo de edição na `UserStats` e `ExplorerProfile`.
    - Integrar `expo-image-picker` para upload de avatar.
    - Aplicar cores dinâmicas no componente de Avatar baseadas no XP recebido.

## Deferred Ideas
- Histórico detalhado de moedas (Coins).
- Loja de Recompensas (Shop).
- Detalhamento de Quests (Lista de objetivos).
- Alteração de preferências pós-onboarding (Fase 10).
