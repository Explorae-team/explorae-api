# PLAN-sdgeu-18-auth.md

## 1. Contexto e Análise Inicial
- **Objetivo**: Implementar e refinar os fluxos de Autenticação para contemplar a Task SDGEU-18 (`POST /auth/register` e `POST /auth/login`), unificando tudo no escopo de *Auth*.
- **Estado Atual**:
  - A rota de login já existe (`POST /auth/login`) com validação de credenciais, porém só retorna o Token (falta devolver os dados mínimos do usuário requisitados pela task).
  - A lógica de cadastro atualmente está roteada como `POST /api/v1/users` no `UserController`. Precisa ser migrada ou criar uma aliasing para `POST /auth/register`.
  - A validação de e-mail duplicado e o salvamento em hash com BCrypt já podem estar pré-configurados no `UserService`, mas é mandatório verificar e adaptar para nossa nova `BusinessException`.

## 2. Divisão de Tarefas (Task Breakdown)

### Fase 1: Ajuste do Cadastro (`POST /auth/register`)
- **[ ] Passo 1**: Mover a rota de criação de usuário de `UserController` para `AuthController` em `@PostMapping("/register")`.
- **[ ] Passo 2**: No `UserService.registerUser`, injetar uma validação do tipo: `userRepository.findByEmail(dto.email()).ifPresent(e -> throw new BusinessException("E-mail já está em uso."))`.
- **[ ] Passo 3**: No `UserService.registerUser`, garantir que `passwordEncoder.encode(dto.password())` está sendo usado.
- **[ ] Passo 4**: Atualizar o `SecurityConfig` para expor `/api/v1/auth/**` totalmente.

### Fase 2: Ajuste do Login (`POST /auth/login`)
- **[ ] Passo 5**: Ajustar o `LoginResponse` ou o dto `TokenResponseDTO` para incorporar o model `UserResponseMinimumDTO` contendo `{id, nome, email}`.
- **[ ] Passo 6**: Atualizar a rota no `AuthController` para usar o Mapper ou instanciar e retornar os dados do `user` recuperado no contexto junto do Token JWT (`tokenService.generate()`).

### Fase 3: Validação
- **[ ] Passo 7**: Executar suíte de testes em `AuthControllerTest` e verificar a refatoração pelo script base de Security.

## 3. Atribuições de Agentes
- **`backend-specialist`**: Irá refatorar o `AuthController`, `UserService` e adaptar a Response.
- **`security-auditor`**: Irá validar o encriptamento BCrypt e garantir que as senhas nunca vazem nas DTOs trafegadas.

## 4. Critério de Aceite (Definition of Done)
- Frontend (que já estava tentando usar a API) consegue bater em `/auth/register` recebendo StandardResponseDTO.
- Requisições duplicadas são barradas (`HTTP 400` + `BusinessException`).
- O `/auth/login` emite um Payload contemplando `token` + `userData`.
