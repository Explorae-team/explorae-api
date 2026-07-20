# Diretrizes, Ferramentas e Infraestrutura de Testes (TESTING.md)

Este documento descreve as ferramentas, práticas e o setup técnico utilizado para a validação contínua da qualidade e comportamento do **Exploraê**.

---

## ☕ 1. Testes no Backend (Spring Boot + JUnit 5 + H2)

O backend possui uma arquitetura de testes piramidal, cobrindo regras de negócio isoladas (testes unitários) e fluxos completos de persistência e integração (testes de integração).

### Ambiente de Execução
*   **Perfis do Spring:** Todas as classes de teste carregam o perfil ativo `@ActiveProfiles("test")`, que instrui o Spring a consumir as definições do arquivo `backend/src/test/resources/application-test.properties`.
*   **Banco de Dados em Memória:** Utiliza **H2 Database** configurado para compatibilidade com a sintaxe do PostgreSQL (`MODE=PostgreSQL`).
*   **Velocidade de Inicialização:** O Liquibase é explicitamente desativado nos testes unitários (`spring.liquibase.enabled=false`). Em vez disso, o Hibernate gera o schema dinamicamente utilizando `spring.jpa.hibernate.ddl-auto=create-drop`, garantindo tempos de execução de testes extremamente baixos.
*   **Isolamento de Redes:** APIs externas (como o Supabase) são mockadas com URLs dummy locais para evitar requisições de rede reais durante a suíte.

### Estrutura dos Testes
*   **Testes de Unidade (`src/test/java/.../unit`):**
    *   Focam na validação lógica dos serviços (`@ExtendWith(MockitoExtension.class)`).
    *   Utilizam mocks com `Mockito` para isolar dependências de Repositórios JPA.
*   **Testes de Integração (`src/test/java/.../integration`):**
    *   Validam a comunicação real entre serviços e o banco H2 em memória utilizando `@SpringBootTest`.
*   **Como Executar os Testes do Backend:**
    No diretório `/backend`, execute:
    ```bash
    ./mvnw test
    ```

---

## 📱 2. Testes no Frontend (Expo + Jest + Testing Library)

O frontend adota uma abordagem de testes focada no comportamento da interface do usuário (UI) e isolamento lógico contra efeitos colaterais de rede.

### Ambiente de Execução
*   **Runner:** Jest (`jest-expo`) configurado para rodar no ecossistema multiplataforma do Expo Router.
*   **Renderizador de UI:** Utiliza `@testing-library/react-native` e `@testing-library/jest-native` para renderizar componentes de forma isolada, disparar eventos reais de clique/digitação e validar estados visuais (textos visíveis, campos habilitados/desabilitados, etc.).
*   **Mocking de Rede:** Mocks completos do **Axios** são configurados de maneira centralizada para interceptar e simular respostas de sucesso e falha das rotas da API Spring Boot.
*   **Mocks Globais:** APIs nativas do dispositivo (como Geolocalização via `expo-location`, armazenamento seguro via `expo-secure-store` e constantes do dispositivo) possuem mocks do Jest configurados no arquivo de setup para não causarem falhas em ambiente Node.

### Localização dos Testes
*   Os testes estão concentrados no diretório `frontend/__tests__/`.
*   Estrutura:
    *   `auth.test.js` / `login.test.tsx` / `cadastro.test.tsx`: Testam o comportamento lógico e interações de telas de onboarding e acesso.
    *   `components/`: Testes unitários para componentes compartilhados como o `AttractionCard` ou `ProgressBar`.
    *   `profile/`: Testes específicos da jornada de perfil e conquistas de medalhas.

### Como Executar os Testes do Frontend:
No diretório `/frontend`, execute:
```bash
npm run test
```
Ou alternativamente, para rodar em modo de observação (watch mode):
```bash
npx jest --watch
```
