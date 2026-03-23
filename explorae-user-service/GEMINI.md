# Exploraê - User Service: Progresso e Contexto

## 🚀 Status Atual
O projeto avançou na Sprint 1 do MVP. Temos os endpoints de saúde (Health) e cadastro de usuários (User Registration) funcionais e seguros.

## ✅ O que já foi feito (Atualizado em 22/03/2026)
- [x] **Setup Inicial**: Spring Boot 4.0.3 configurado com Java 21.
- [x] **Banco de Dados**: Configuração do Liquibase e criação da tabela `users` (UUID, email, password_hash, xp, level, coins).
- [x] **Entidades**: Entidade `User` no pacote `domain.user` com `@PrePersist` para valores padrão.
- [x] **SDGEU-10 (CORS/Erros)**: Configurado `@RestControllerAdvice` para tratamento global de exceções e políticas de CORS liberadas para o frontend.
- [x] **SDGEU-19-BE (Cadastro)**: Implementado endpoint `POST /api/v1/users` com:
    - **DTOs**: `UserRegistrationDTO` para entrada e `UserResponseDTO` para saída (sem senha).
    - **Mapper**: **MapStruct** para conversão performática entre Entidades e DTOs.
    - **Segurança**: Senhas criptografadas com **BCrypt**.
- [x] **Git**: Fluxo GitFlow seguido rigorosamente. Todas as features (SDGEU-10 e SDGEU-19-BE) foram mescladas na `develop` e enviadas para o remoto.

## 📌 Próximos Passos (Backlog Imediato)
1. **SDGEU-15/17 (Prioridade)**: Implementar Spring Security com JWT (filtros, autenticação e geração de tokens para Login).
2. **SDGEU-19-FE**: Implementar tela de Cadastro em React (Frontend).
3. **Refatoração de Testes**: Ajustar dependências de teste (H2) que apresentaram conflitos de compilação.

## 🛠 Decisões Técnicas
- **ID**: Uso de `UUID` para todos os identificadores de entidade.
- **Mapeamento**: MapStruct preferido sobre ModelMapper por performance e segurança de tipos.
- **Resposta Padrão**: Uso do `StandardResponseDTO` em todos os endpoints para consistência na comunicação com o Frontend.
- **Segurança**: Endpoint de cadastro liberado no `SecurityConfig`, demais endpoints exigirão autenticação JWT.

## 📝 Padrão de Comentários (Humano & Direto)
Para facilitar o aprendizado do time, os comentários devem ser objetivos, humanos e focar no "porquê" ou na "função" do código, evitando termos robóticos.

**Exemplos de Referência:**
```java
// Regras de Segurança: Quem entra, quem precisa de token e como as portas são vigiadas.
@Configuration
public class SecurityConfig { ... }

// Valida o email e senha, comparando com o banco.
@Bean
public AuthenticationManager authenticationManager(...) { ... }

// 1. Pega o cabeçalho 'Authorization' da requisição.
String authHeader = request.getHeader("Authorization");

// Se estiver ok, cria um crachá de autenticação.
UsernamePasswordAuthenticationToken authToken = ...
```

---
*Última atualização: 23 de março de 2026*
