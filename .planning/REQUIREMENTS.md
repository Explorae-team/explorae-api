# Requirements - Sprint 06 (Refatoração do Módulo User)

## Overview
A Sprint 06 focará na aplicação estrita dos princípios SOLID (SRP, OCP, LSP, ISP e DIP) no módulo `user` do backend (Spring Boot), visando desacoplar a camada de serviços com interfaces e implementações segregadas, estruturar controllers sem lógica de negócio residual e limpar a entidade de domínio JPA de acoplamentos externos.

## User Stories

### [SDGEU-REF-USER] Refatoração SOLID do Módulo User
**Descrição**: Como arquiteto/desenvolvedor de software, desejo refatorar o módulo de Usuário (User) para que o código siga as boas práticas do SOLID, melhorando a manutenibilidade, testabilidade e desacoplamento do sistema.

- **Requisitos Funcionais**:
  - [ ] **Introdução de Interfaces de Serviço (LSP/DIP):** Criar interfaces e implementações concretas (ex: `UserService` e `UserServiceImpl`, `AuthService` e `AuthServiceImpl`, etc.). Garantir que controllers e outros componentes dependam das abstrações (interfaces), facilitando mocks em testes.
  - [ ] **Segregação de Responsabilidades (SRP/ISP):** Dividir as responsabilidades do `UserService` que atua como God Service. Extrair a lógica de gamificação, perfil agregado e controle de preferências para serviços coesos (ex: `UserProfileService`, `UserPreferenceService`).
  - [ ] **Limpeza de Controllers (SRP):** Refatorar o `UserController` para atuar puramente como camada de recepção e resposta HTTP, delegando qualquer validação complexa ou regra de negócio para a camada de serviços. Impedir o uso direto de Repositórios e injeções impróprias de outras features.
  - [ ] **Desacoplamento da Entidade de Domínio (OCP):** Limpar a classe de domínio `User` (JPA Entity), isolando validações de DTOs (Bean Validation) e transferindo lógicas de apresentação/negócio secundárias para componentes adequados.
  - [ ] **Suite de Testes Integrais:** Ajustar todos os testes unitários e de integração existentes no backend para refletirem as novas estruturas, garantindo que não existam regressões no fluxo de login, cadastro, perfil e gamificação.
- **Critérios de Aceite**:
  - [ ] O backend compila sem erros.
  - [ ] Todos os serviços do módulo `user` possuem interfaces expostas como seus respectivos contratos.
  - [ ] As responsabilidades de perfil/autenticação/gamificação estão claramente distribuídas.
  - [ ] A cobertura de testes automatizados é mantida e todos os 49+ testes JUnit de backend passam com sucesso.
