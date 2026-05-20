# Learnings - Sprint 03 Stabilization & Feed Integration

Este documento consolida os aprendizados técnicos e de processo acumulados durante a estabilização da infraestrutura de testes e a conclusão do Feed de Atrações (SDGEU-154).

## 🏗️ Arquitetura & Decisões Técnicas

### 1. Spring Boot 4.0.3 + Java 25
- **Modularização de Testes**: Descobrimos que o `spring-boot-starter-test` no Spring Boot 4.0 não inclui mais automaticamente todas as configurações para Web MVC. Foi necessário adicionar explicitamente o `spring-boot-starter-webmvc-test` para habilitar o `@WebMvcTest`.
- **MockitoBean**: A transição para a nova anotação `MockitoBean` (substituindo `@MockBean`) foi necessária para compatibilidade com o Spring Framework 6.2+.
- **Records como DTOs**: O uso de `record` para DTOs (ex: `AttractionResponseDTO`) simplifica o código, mas exige atualização de todos os construtores manuais em testes quando novos campos são adicionados (falta de flexibilidade de construtores sobrecarregados automáticos).

### 2. Monorepo & Sincronia
- **Contrato de API**: Mudanças no modelo de dados do backend (ex: adicionar `priceRange`) devem refletir imediatamente no DTO e no mapeamento do Frontend (`useExploreData.ts`). A falta dessa sincronia causa "furos" funcionais em User Stories aparentemente concluídas.

## 🧪 Padrões de Teste & Estabilização

### 1. Testes Expo/React Native
- **Extensões de Arquivo**: Testes que envolvem sintaxe JSX/TSX em projetos TypeScript devem usar obrigatoriamente a extensão `.test.tsx`. O uso de `.test.jsx` pode causar erros de parsing no Babel/Jest dependendo da configuração.
- **Mocks de Alta Fidelidade**: Para evitar avisos de `act()` e erros de stream, é essencial mockar bibliotecas nativas de forma robusta:
    - `@expo/vector-icons`: Deve retornar um componente funcional simples.
    - `expo-router`: Mockar `useRouter` e `useSegments` é crítico para componentes que dependem de navegação.
- **Timeout Global**: Em ambientes de execução limitados (sandboxes), testes de componentes complexos do React Native podem levar mais de 5s. Ajustar o `jest.setTimeout(30000)` globalmente no `jest.setup.js` reduz a intermitência (*flakiness*).

### 2. Tipagem em Mocks
- **Implicit Any**: Ao usar `jest.mock`, é comum esquecer de tipar as funções mockadas. O uso de `(mockAxios.post as any).mockResolvedValue(...)` é uma solução rápida, mas deve-se buscar tipos mais específicos quando possível para manter a segurança do TS.

## 🎨 UI/UX & Padrões Visuais

### 1. Componente AttractionCard
- **Variantes**: O padrão de usar uma prop `variant` ('default' | 'compact') permite reutilizar a lógica de dados em diferentes contextos (Feed Principal vs Carrossel de Recomendações) sem duplicar código.
- **Identificadores Visuais**: O uso de badges (`isPartner`, `isNew`) aumenta a confiança do usuário e melhora a hierarquia de informação.

### 2. Fluxo de Onboarding
- **Redirecionamento Forçado**: A decisão de forçar o usuário sem preferências para a tela `/preferences` via middleware ou layout root é eficaz para garantir que o algoritmo de recomendação tenha dados para trabalhar.

## ⚠️ Surpresas & "Gotchas"

- **Campos Ocultos em US**: A US SDGEU-154 parecia concluída apenas com a paginação, mas os critérios de aceitação exigiam campos de "Preço" e "Parceiro" que foram negligenciados na primeira implementação. **Lição**: Sempre revisar os Critérios de Aceitação (AC) antes de marcar como pronto.
- **Metro Cache**: Muitas falhas de "Internal Server Error" no Expo Web são resolvidas apenas com a limpeza completa do cache (`npx expo start -c`).

## 🚀 Insights para as Próximas Fases

1. **Dockerização**: A infraestrutura de testes agora estável deve ser a base para os `healthchecks` no Docker Compose.
2. **Documentação Dinâmica**: O `GEMINI.md` provou ser vital para manter o contexto entre sessões, especialmente em tarefas longas de refatoração de testes.
