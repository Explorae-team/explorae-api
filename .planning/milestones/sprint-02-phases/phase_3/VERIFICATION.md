# Phase 3 Verification: UI Onboarding

## 🧪 Acceptance Criteria

### Redirecionamento (TRAV-05/06)
- [x] **AC-01**: Usuário logado SEM preferências (`hasPreferences: false`) é forçado para `/preferences`.
- [x] **AC-02**: Usuário logado COM preferências (`hasPreferences: true`) acessa o `/dashboard` diretamente.
- [x] **AC-03**: A rota `/preferences` não é acessível para usuários não autenticados.

### Interface de Preferências (TRAV-04)
- [x] **AC-04**: O Grid exibe todas as categorias definidas (Natureza, Culinária, etc) conforme design do Stitch.
- [x] **AC-05**: Seleção múltipla funciona visualmente (destaque no card selecionado).
- [x] **AC-06**: O botão de envio fica desabilitado se nenhum interesse for selecionado.

### Integração API (SDGEU-191)
- [x] **AC-07**: O envio chama o endpoint `PUT /api/v1/users/me/preferences` com sucesso.
- [x] **AC-08**: O estado global do usuário (AuthContext) é atualizado após o sucesso (configurando `hasPreferences: true`).

## 🛠 Verification Steps

### Manual Walkthrough
1. **Novo Cadastro**:
   - Registrar novo usuário.
   - Verificar se caiu na tela de Preferências (`/preferences`).
   - Selecionar interesses.
   - Clicar em Finalizar.
   - Verificar redirecionamento para Dashboard.
2. **Re-login**:
   - Deslogar.
   - Logar novamente com o mesmo usuário.
   - Verificar se caiu direto no Dashboard (sem passar pelas Preferências).

### Logs & Network
- [x] Verificar no console/network se a requisição PUT está enviando o JSON correto: `{"interests": ["...", "..."]}`.
- [x] Verificar se o `StandardResponseDTO` está sendo tratado corretamente.
