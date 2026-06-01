# Convenções, Padrões e Regras de Negócio (CONVENTIONS.md)

Este documento detalha as convenções de desenvolvimento, padrões de codificação, guias de estilo e as principais fórmulas de regras de negócio que regem o **Exploraê**.

---

## 💬 1. Padrões de Mensagens de Commit

Todas as mensagens de commit feitas no repositório devem ser escritas em **Português** e seguir o padrão de prefixos semânticos baseados em Conventional Commits:

*   `feat`: Implementação de novas funcionalidades (ex: `feat: adiciona componente de mapa interativo no frontend`).
*   `fix`: Correções de bugs (ex: `fix: corrige cálculo de distância no feed de atrações`).
*   `chore`: Atualizações de build, dependências ou tarefas administrativas (ex: `chore: adiciona chave do google maps ao .env`).
*   `docs`: Alterações em arquivos de documentação (ex: `docs: cria mapas de codebase no planejamento`).
*   `refactor`: Modificações de código que não alteram o comportamento final do sistema.
*   `test`: Adição ou melhoria de suítes de testes.

---

## 📝 2. Padrão de Comentários no Código (Humano & Direto)

*   **Foco no "Porquê":** Evitamos comentários óbvios que simplesmente explicam o que o código faz (ex: `// incrementa o valor`). Em vez disso, focamos em explicar a intenção de negócio ou decisões não óbvias.
*   **Tom Objetivo:** Comentários humanos e diretos ao ponto, sem formalidades excessivas.

```java
// Bom exemplo:
// Usamos HSL dinâmico para garantir contraste visual independentemente do tema do dispositivo
float lightness = isDarkMode ? 0.85f : 0.45f;
```

---

## 📡 3. Comunicação de APIs (`StandardResponseDTO`)

Todas as respostas HTTP enviadas pelo backend devem estar encapsuladas na estrutura unificada de resposta `StandardResponseDTO` para garantir a previsibilidade e facilitar o consumo no cliente móvel.

```java
public class StandardResponseDTO<T> {
    private boolean success;
    private String message;
    private T data;
    private List<String> errors;
    private PageMetadata page; // Opcional, usado apenas em respostas paginadas
}
```

*   **Paginação Uniforme:** Sempre que um endpoint retornar coleções (como o feed de atrações), os metadados de paginação (número da página, tamanho, total de elementos e se há próxima página) devem ser incluídos no objeto `PageMetadata` dentro do DTO.

---

## 🎮 4. Regras de Negócio de Gamificação

A progressão e o incentivo à exploração utilizam um modelo matemático linear para evolução de níveis.

*   **Fórmula de Nível (XP):** A quantidade de XP necessária para o usuário alcançar o próximo nível é dada pela fórmula:
    $$\text{XP para o próximo nível} = \text{Nível Atual} \times 100$$
    *   Exemplo: Um usuário no **Nível 1** precisa acumular **100 XP** adicionais para chegar ao **Nível 2**. Quando chega no **Nível 2**, precisará de **200 XP** adicionais para o **Nível 3**, e assim por diante.
*   **Eventos de Ganho de XP:** O XP é concedido por interações ativas:
    *   Avaliando uma atração turística.
    *   Realizando Check-in geolocalizado (comprovando presença no raio da atração).
    *   Concluindo Desafios Semanais ou Temáticos.

---

## 🗺️ 5. Fluxo de Onboarding de Preferências de Viagem

*   **Redirecionamento Forçado:** O sistema impede que usuários sem interesses selecionados naveguem livremente pelo aplicativo.
*   **Validação na Inicialização:** Ao carregar o app, o `AuthContext` valida se a coleção de `TravelPreference` do usuário está vazia. Caso esteja, o roteador do Expo Router força o redirecionamento imediato para a rota `/preferences` e bloqueia o botão de voltar até que ao menos três categorias de interesses sejam selecionadas e salvas.
