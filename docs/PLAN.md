# Plano de Refatoração: Clean Code & SOLID

## Objetivos da Refatoração
1. **Remover `@Data` das Entidades (Domains):** O `@Data` do Lombok gera `equals`, `hashCode` e `toString` usando todos os atributos, o que frequentemente causa *StackOverflowError* ou problemas de performance em entidades JPA devido a relacionamentos (Lazy Loading/Ciclos infinitos). Substituiremos por `@Getter`, `@Setter` e implementaremos um `equals`/`hashCode` apropriado baseado apenas no ID (ou usaremos `@EqualsAndHashCode(onlyExplicitlyIncluded = true)` e marcaremos o ID).
2. **Remover `@PrePersist` das Entidades:** O uso de `@PrePersist` para inicializar variáveis básicas (como `xp = 0`, `createdAt = LocalDateTime.now()`) é desnecessário. A inicialização direta no momento da declaração do atributo (ou no construtor) é mais eficiente e previsível no ciclo de vida do Java.
3. **Mover Lógica de Negócio para o Service:** Atualmente, os Controllers (`AuthController` e `UserController`) estão orquestrando lógicas complexas (como autenticação) e convertendo Entidades para DTOs.
   - Pelo princípio da Responsabilidade Única (SRP - SOLID), o Controller deve apenas receber a requisição, chamar o Service, e retornar a resposta HTTP.
   - O mapeamento (Entidade -> DTO) e a orquestração do login (AuthenticationManager + JWT) devem ocorrer nos Services.
   - O Service passará a retornar DTOs diretamente em vez de Entidades.
4. **Criação do AuthService:** Extrair a lógica do `AuthController` para um novo `AuthService`, centralizando as regras de login e registro.

## Passos para Implementação

### 1. Refatorar Entidades (Domain)
Arquivos afetados:
- `User.java`
- `TravelPreference.java`
- `Attraction.java`
- `XpHistory.java`
- `UserBadge.java`
- `Badge.java`

**Ações:**
- Substituir `@Data` por `@Getter`, `@Setter`, `@NoArgsConstructor`, `@AllArgsConstructor` e `@Builder` (opcional).
- Adicionar `@EqualsAndHashCode(onlyExplicitlyIncluded = true)` e marcar apenas o campo `id` com `@EqualsAndHashCode.Include` para garantir consistência em Set e Collections.
- Remover os métodos anotados com `@PrePersist`.
- Inicializar valores padrão (ex: `createdAt`, `xp`, `level`) diretamente na declaração dos atributos nas entidades.

### 2. Refatorar Serviços (Service)
Arquivos afetados:
- `UserService.java`
- Criar `AuthService.java`

**Ações:**
- Em `UserService`, alterar os métodos (`registerUser`, `updateUser`, `findById`) para retornarem DTOs (`UserResponseDTO`) em vez da entidade `User`. O mapeamento (usando `UserMapper`) ocorrerá dentro do Service.
- Criar `AuthService` para encapsular a lógica de autenticação (`AuthenticationManager`) e geração de token (`TokenService`), retornando o `AuthLoginResponseDTO`.

### 3. Refatorar Controladores (Controller)
Arquivos afetados:
- `AuthController.java`
- `UserController.java`

**Ações:**
- Limpar `AuthController` para injetar apenas o `AuthService`.
- Limpar `UserController` para retornar diretamente os DTOs vindos do `UserService`, sem injetar e utilizar o `UserMapper` no Controller.

### 4. Validação (Test Engineer)
- Garantir que o projeto compila após as mudanças de retorno (Entidade para DTO).
- Verificar que o `equals` e `hashCode` estão consistentes.
- Rodar o projeto e confirmar que a refatoração não quebrou os endpoints (via curl ou manual se aplicável).

## Ferramentas & Agentes a serem acionados (Fase 2)
Após aprovação, invocarei em paralelo:
- **`backend-specialist`**: Para refatorar as Entidades, Controladores e Serviços.
- **`database-architect`**: Para confirmar a estabilidade dos mapeamentos JPA.
- **`test-engineer`**: Para garantir a integridade da aplicação após as mudanças.
