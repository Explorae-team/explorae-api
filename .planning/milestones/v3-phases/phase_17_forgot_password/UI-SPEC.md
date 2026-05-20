# UI-SPEC: Recuperar Senha (Forgot Password)

## 🎨 Visual Identity
- **Primary Color**: `#fd6c28` (Laranja Exploraê)
- **Background**: `#003646` (Petróleo Profundo)
- **Typography**: Inter (ou padrão do sistema)
- **Border Radius**: 24px (rounded-3xl) para o card central.

## 📱 Screen Structure

### 1. Main Layout
- **Wrapper**: `KeyboardAvoidingView` com fundo `#003646`.
- **Background Effect**: Elemento decorativo circular `bg-[#fd6c28]/10` com blur.

### 2. Central Card
- **Logo**: Centralizado no topo (Assets: `logo-main.png`).
- **Título**: "Recuperar Senha" (`text-[#003646] font-bold text-2xl`).
- **Descrição**: "Não se preocupe! Informe seu e-mail abaixo e enviaremos as instruções para você criar uma nova senha." (`text-slate-500 text-sm`).

### 3. Form Components
- **Email Input**: 
  - Componente: `AuthInput`.
  - Icon: `mail-outline`.
  - Placeholder: "aventureiro@explorae.com".
- **Action Button**:
  - Componente: `PrimaryButton`.
  - Title: "ENVIAR LINK".
  - Loading Title: "ENVIANDO...".

### 4. Navigation
- **Footer**: "Lembrou a senha? **Voltar para o Login**".
- **Link Color**: `#FFB700`.

## 🔄 Interaction States
- **Loading**: Botão desabilitado com spinner.
- **Success**: Exibir mensagem de confirmação: "Link enviado! Verifique sua caixa de entrada." no lugar do formulário ou via Toast/Alert.
- **Error**: Exibir feedback visual no `AuthInput` se o e-mail for inválido ou não encontrado.

## 🧩 Reusable Components
- `src/components/auth/AuthInput.tsx`
- `src/components/PrimaryButton.tsx`
