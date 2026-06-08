# Design Spec: Novo Fluxo de Roteamento com Zustand

## 1. Visão Geral
Modificar o fluxo de seleção de rotas para que as atrações possam ser adicionadas à fila de roteiro a partir da página de detalhes da atração (`[id].tsx`). Para isso, implementaremos um estado global moderno e escalável usando a biblioteca **Zustand**.

## 2. Decisões Arquiteturais (Por que Zustand?)
Optamos pelo **Zustand** (Opção 3) por ser a escolha **mais moderna e recomendada** para React Native atualmente:
- **Performance:** Evita os re-renders desnecessários que o React Context API causa em árvores de componentes grandes.
- **Simplicidade:** Não exige "Providers" poluindo o `_layout.tsx`.
- **Usabilidade:** O código fica muito mais limpo e legível.

## 3. Estrutura do Estado Global (Zustand Store)
Será criado o arquivo `frontend/src/store/useRouteStore.ts` com a seguinte assinatura:

- **Estado:**
  - `routeQueue`: Lista de atrações (`Attraction[]`).
- **Ações:**
  - `addAttraction(attraction)`: Adiciona a atração ao **final** da fila (se não existir).
  - `navigateNow(attraction)`: Remove a atração da fila caso já exista e a insere no **topo (índice 0)**.

## 4. Modificações na UI
### 4.1. Página Detalhes da Atração (`[id].tsx`)
O botão solitário "TRAÇAR ROTA" será substituído por dois botões organizados lado a lado:
1. **Adicionar ao Roteiro** (Visual Secundário/Outline)
   - Ação: `addAttraction(attraction)`
   - Feedback visual: Exibe um Toast/Alerta de "Atração adicionada ao seu roteiro!" e o usuário continua na tela atual.
2. **Navegar Agora** (Visual Primário/Preenchido)
   - Ação: `navigateNow(attraction)` seguido de `router.push('/dashboard/routes')`
   - O usuário será redirecionado imediatamente para o mapa, com a atração definida como alvo principal.

### 4.2. Página do Mapa de Rotas (`dashboard/routes.tsx`)
- Remover a dependência do estado local `const [attractionsList, setAttractionsList] = useState([])`.
- Passar a consumir a fila global: `const routeQueue = useRouteStore((state) => state.routeQueue)`.
- A lógica de *Nearest Neighbor* (roteiro inteligente) continuará ativa para ordenar os próximos destinos automaticamente sempre que a fila mudar, mas respeitará a atração selecionada no topo.

## 5. Próximos Passos (Implementação)
1. Instalar a biblioteca `zustand` no frontend (`npm install zustand`).
2. Criar o store `useRouteStore.ts`.
3. Atualizar `routes.tsx` para ler/escrever deste store.
4. Atualizar `[id].tsx` para conter os novos botões conectados ao store.
