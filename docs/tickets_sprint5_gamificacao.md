# Sprint 5: XP e Level Up (Gamificação) - Detalhamento de Tickets

## [SDGEU-247] [S3-P1-T1] Modelar Entidades de Gamificação (XpHistory, Badge)
*   **Responsável sugerido:** Backend Developer / Database Specialist
*   **Descrição:**
    Estruturar as tabelas e entidades necessárias para armazenar o histórico de ganho de XP e as medalhas conquistadas pelos usuários. Garantir que as migrations do Liquibase rodem corretamente.
*   **Passos Técnicos:**
    1. Criar a entidade `XpHistory` com atributos: `id` (UUID), `user` ( relacionamento `@ManyToOne` com `User`), `amount` (Integer), `reason` (String) e `createdAt` (LocalDateTime).
    2. Criar a entidade `Badge` com atributos: `id` (UUID), `name` (String), `description` (String), `iconUrl` (String).
    3. Criar a entidade associativa/tabela `UserBadge` para registrar quais medalhas pertencem a quais usuários.
    4. Criar scripts de migration no Liquibase (`db/changelog`) para gerar as tabelas `xp_history`, `badges` e `user_badges` com chaves estrangeiras apropriadas.
*   **Critérios de Aceite:**
    *   [ ] Entidades mapeadas no JPA.
    *   [ ] Migrations do Liquibase executadas com sucesso sem erros de DDL.
    *   [ ] Entidades testadas com massa de dados local.

---

## [SDGEU-249] [S3-P1-T2] Implementar Serviço de XP e Fórmula de Level Up
*   **Responsável sugerido:** Backend Developer
*   **Descrição:**
    Implementar o serviço de negócio (`GamificationService`) para adição de XP, concessão de medalhas e cálculo matemático da progressão de nível.
*   **Fórmula Matemática:**
    *   A progressão de nível deve seguir a regra: o XP necessário para o próximo nível é igual a `nível * 100`.
    *   *Nota de Consistência:* Se o Usuário está no Nível 1, ele precisa de 100 XP para ir ao Nível 2 (total acumulado: 100 XP). No Nível 2, ele precisa de mais 200 XP para ir ao Nível 3 (total acumulado: 300 XP).
*   **Passos Técnicos:**
    1. Implementar método `addXp(userId, amount, reason)` que adiciona XP ao usuário, valida se ele atingiu a meta para Level Up (loop cumulativo) e salva o registro no histórico (`XpHistory`).
    2. Implementar lógica para conceder medalhas automáticas caso o usuário atinja conquistas específicas.
    3. Escrever testes unitários e de integração para garantir a precisão da fórmula matemática do Level Up.
*   **Critérios de Aceite:**
    *   [ ] O cálculo de progressão funciona corretamente para saltos de múltiplos níveis (ex: ganhar 500 XP de uma vez).
    *   [ ] A transação é revertida caso a gravação do histórico ou do usuário falhe (`@Transactional`).
    *   [ ] Cobertura de testes unitários validando a progressão.

---

## [SDGEU-251] [S3-P3-T1] Desenvolver Barra de Progresso e Level Badge (Expo/Native)
*   **Responsável sugerido:** Frontend Developer
*   **Descrição:**
    Desenvolver os componentes visuais do perfil do usuário para exibir o nível atual (Badge) e uma barra de progresso horizontal indicando o progresso percentual até o próximo nível de forma animada e elegante.
*   **Passos Técnicos:**
    1. Criar componente `ProgressBar` que recebe o XP atual e o nível do usuário.
    2. Calcular o progresso percentual relativo baseado na fórmula:
       `Progresso = (XP do nível atual / XP necessário para passar o nível atual) * 100`.
    3. Adicionar um ícone visual estilizado (Badge) com cores dinâmicas baseadas na faixa de XP ou nível do usuário (ex: Bronze, Prata, Ouro).
*   **Critérios de Aceite:**
    *   [ ] A barra de progresso enche corretamente e não ultrapassa os limites visuais (0% a 100%).
    *   [ ] Exibição numérica do progresso clara (ex: "150 XP / 200 XP").
    *   [ ] Visual adaptável a telas de diferentes tamanhos (Responsividade).
