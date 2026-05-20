# Phase 3 Context: UI Onboarding (SDGEU-193)

## 🎯 Goal
Implementar a interface de Onboarding no App Expo para coletar as preferências de viagem (interesses) do usuário e garantir o fluxo de redirecionamento correto.

## 🧠 Decisions

### 1. Fluxo de UI
- **Formato**: Tela única (Single Screen) com um grid de seleção múltipla, baseada no design do Stitch.
- **Stitch ID**: `5bfcbe6417a74013974160a577127cda` (Projeto `9741619389382073381`).
- **Componentes**: Cards ou Chips clicáveis que mudam de estado visual ao serem selecionados.
- **Feedback**: Botão "Finalizar" ou "Continuar" que só habilita após pelo menos uma seleção (conforme regra do backend).

### 2. Lógica de Redirecionamento (TRAV-05)
- **Localização**: A verificação de "Primeiro Acesso / Necessidade de Onboarding" será feita no **`_layout.jsx`** do diretório `app`.
- **Mecanismo**: 
    1. Usuário loga.
    2. O layout verifica se o usuário possui preferências configuradas (via API).
    3. Se não possuir, redireciona para `/preferences`.
    4. Se já possuir, segue para o Dashboard.

### 3. Integração com Backend
- **Endpoint de Consulta**: `GET /api/v1/users/me/preferences` (para verificar se já preencheu).
- **Endpoint de Gravação**: `PUT /api/v1/users/me/preferences`.
- **Formato**: Envio de um array de strings no campo `interests`.

### 4. Estilo Visual
- **Tech**: NativeWind (Tailwind CSS para React Native).
- **Consistência**: Deve seguir o design system já utilizado nas telas de Login e Cadastro (cores, arredondamento de bordas, tipografia).

## 🛠 Tech Stack (Reforço)
- **Framework**: Expo Router.
- **Styling**: NativeWind v4.
- **HTTP Client**: Axios (configurado com o token JWT do SecureStore).

## 🚀 Next Steps
1. Executar `@/gsd-plan-phase 3` para detalhar as ondas de implementação.
2. Definir a lista final de interesses durante a execução da wave de UI.
