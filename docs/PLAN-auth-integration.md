# PLAN-auth-integration.md

## 1. Overview
Este plano detalha a implementação da Task **SDGEU-21 (Integrar autenticação no frontend)** do projeto Exploraê. O objetivo é transformar o mock de autenticação atual em uma integração real com o backend Spring Boot utilizando JWT, Axios, React Context e Expo SecureStore para persistência segura.

- **Status**: 📝 Planejamento concluído
- **Task ID**: SDGEU-21
- **Prioridade**: P0 (Bloqueador para features de perfil e gamificação)

## 2. Project Type
**MOBILE** (React Native com Expo Router)

## 3. Success Criteria
- [ ] O token JWT deve ser armazenado com segurança usando `expo-secure-store`.
- [ ] O usuário deve ser redirecionado automaticamente para o login ao tentar acessar rotas protegidas sem estar autenticado.
- [ ] O usuário autenticado deve ser redirecionado para o `/dashboard` ao iniciar o app.
- [ ] Requisições à API devem incluir automaticamente o cabeçalho `Authorization: Bearer <token>`.
- [ ] O estado global (React Context) deve persistir os dados básicos do usuário (nome, id, email).
- [ ] Tratamento de erros de autenticação (ex: senha inválida, token expirado) deve exibir feedback visual.

## 4. Tech Stack
- **Framework**: Expo (React Native)
- **State Management**: React Context API
- **Cliente HTTP**: Axios (com interceptors)
- **Persistência**: `expo-secure-store`
- **Variáveis de Ambiente**: `.env` (via manual setup ou `expo-constants`)
- **Navegação**: `expo-router`

## 5. File Structure
```bash
/frontend
├── .env                  # Variáveis de ambiente (API_URL)
├── src
│   ├── services
│   │   └── api.js        # Configuração do Axios + Interceptors
│   ├── contexts
│   │   └── AuthContext.jsx # Lógica de login/logout real
│   └── hooks
│       └── useStorage.js # (Opcional) Helper para SecureStore
└── app
    ├── (auth)            # Grupo de rotas protegidas
    │   └── _layout.jsx   # Middleware de proteção
    ├── login.jsx         # Atualização para chamada real
    └── cadastro.jsx      # Atualização para chamada real
```

## 6. Task Breakdown

### Phase 1: Setup & Dependencies
| Task ID | Component | Task Name | Agent | Skills | Priority | Dependencies |
|---------|-----------|-----------|-------|--------|----------|--------------|
| T1.1 | Environment | Instalar dependências e criar .env | `mobile-developer` | `bash-linux`, `nodejs-best-practices` | P0 | - |
| T1.2 | API Client | Criar `api.js` configurado com Axios | `mobile-developer` | `api-patterns`, `clean-code` | P0 | T1.1 |

**INPUT**: `package.json`, `.env` template
**OUTPUT**: `axios` e `expo-secure-store` instalados, `src/services/api.js` criado.
**VERIFY**: Comando `npm list axios` retorna sucesso e `api.js` exporta instância de axios.

---

### Phase 2: Core Auth Logic
| Task ID | Component | Task Name | Agent | Skills | Priority | Dependencies |
|---------|-----------|-----------|-------|--------|----------|--------------|
| T2.1 | Context | Implementar lógica real no `AuthContext.jsx` | `mobile-developer` | `react-best-practices`, `clean-code` | P0 | T1.2 |
| T2.2 | Security | Integrar `SecureStore` para salvar/carregar token | `mobile-developer` | `security-auditor` | P0 | T2.1 |

**INPUT**: `AuthContext.jsx` mockado.
**OUTPUT**: `AuthContext.jsx` com funções `login`, `register`, `logout` chamando a API e persistindo o token.
**VERIFY**: Ao chamar `login`, o token deve aparecer no log (apenas em dev) e ser salvo no secure storage.

---

### Phase 3: Integration & UI
| Task ID | Component | Task Name | Agent | Skills | Priority | Dependencies |
|---------|-----------|-----------|-------|--------|----------|--------------|
| T3.1 | Screen | Conectar tela de login ao serviço | `mobile-developer` | `frontend-design` | P1 | T2.1 |
| T3.2 | Screen | Conectar tela de cadastro ao serviço | `mobile-developer` | `frontend-design` | P1 | T2.1 |
| T3.3 | Navigation| Implementar middleware de proteção no `_layout.jsx` | `mobile-developer` | `react-best-practices` | P1 | T2.1 |

**INPUT**: `login.jsx`, `cadastro.jsx`, `app/_layout.jsx`
**OUTPUT**: Telas funcionais com estados de erro e redirecionamento de segurança.
**VERIFY**: Tentar acessar `/dashboard` sem token redireciona para `/login`.

## 7. Phase X: Final Verification
- [ ] **Lint**: Executar `npm run lint`.
- [ ] **Type Check**: N/A (JS Project).
- [ ] **Security**: Verificar se o token NÃO está sendo salvo em `AsyncStorage` (apenas `SecureStore`).
- [ ] **E2E Manual**: 
    - [ ] Registrar novo usuário -> Sucesso.
    - [ ] Login com credenciais certas -> Redireciona para Dashboard.
    - [ ] Login com credenciais erradas -> Erro visual.
    - [ ] Logout -> Retorna para Login e limpa Storage.
    - [ ] Fechar e reabrir app logado -> Mantém autenticação.

# ✅ PHASE X COMPLETE
- Lint: [ ]
- Security: [ ]
- Date: [ ]
