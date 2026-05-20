# Plano de Execução - Phase 17: Recuperar Senha

Implementação da tela de recuperação de senha no frontend, permitindo que usuários solicitem um link de redefinição via e-mail.

## 📋 Objetivos
- Criar a rota `/recuperar-senha` no Expo Router.
- Desenvolver a interface baseada no `UI-SPEC.md`.
- Integrar com o serviço de autenticação (simulado ou real conforme backend).
- Garantir a navegação fluida entre Login e Recuperação.

## 🛠️ Tarefas

### 1. Roteamento e Estrutura
- [x] Criar o arquivo `frontend/src/app/recuperar-senha.tsx`.
- [x] Atualizar o link "Esqueceu?" na tela de `login.tsx` para apontar para a nova rota.

### 2. Interface (UI)
- [x] Implementar o layout conforme `UI-SPEC.md`.
- [x] Reutilizar `AuthInput` e `PrimaryButton`.
- [x] Adicionar validação básica de e-mail.

### 3. Lógica e Integração
- [x] Implementar a função `handleResetPassword` no componente.
- [ ] (Opcional) Adicionar método `resetPassword` no `AuthContext.jsx` se o backend suportar.
- [x] Mostrar feedback de sucesso após o envio.

## 🧪 Verificação (UAT)
- [x] Ao clicar em "Esqueceu?" no login, o usuário deve ser levado para `/recuperar-senha`.
- [x] O campo de e-mail deve validar o formato.
- [x] O botão deve mostrar estado de loading.
- [x] Após o "envio", uma mensagem de sucesso deve ser exibida.
- [x] O link de volta para o login deve funcionar.
