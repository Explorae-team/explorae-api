# Phase 10: Exibir Carrossel de Recomendações no Feed (Expo/Native) - Research

## Technical Discovery

### 1. Geolocalização em Expo (expo-location)
Para obter a localização física do usuário no frontend React Native/Expo, utilizaremos o módulo oficial `expo-location`. 
* **Dependência**: É necessário instalar o pacote `expo-location` via `npx expo install expo-location`. Isso garante compatibilidade perfeita com a versão corrente do Expo.
* **Uso da API**:
  - `Location.requestForegroundPermissionsAsync()`: Solicita a permissão do usuário em primeiro plano. Retorna `{ status }`.
  - `Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced })`: Obtém a localização atual do usuário.
* **Comportamento Web & Fallback**: O `expo-location` possui compatibilidade total com navegadores Web através do standard `navigator.geolocation` sob o capô, garantindo portabilidade para o PWA. Caso a permissão seja negada ou haja falha na requisição, capturamos o erro e retornamos coordenadas nulas (`null`), o que aciona o fallback do backend de forma transparente.

### 2. Integração com Endpoint `/api/v1/attractions/recommendations`
* **Parâmetros de Query**:
  - `latitude` (Double, opcional)
  - `longitude` (Double, opcional)
  - `page` (Integer, padrão 0)
  - `size` (Integer, padrão 10 ou 15)
* **Response Contract (StandardResponseDTO)**:
  - O backend envelopa a paginação sob a chave `data`. A estrutura recebida é:
    ```json
    {
      "success": true,
      "message": "...",
      "data": {
        "content": [
          {
            "id": "...",
            "name": "...",
            "shortDescription": "...",
            "mainImageUrl": "...",
            "averageRating": 4.5,
            "distance": "2.4 km",
            "category": "Cultura",
            "tags": ["Arte", "Museu"],
            "priceRange": 2,
            "isPartner": true
          }
        ],
        "pageable": { ... },
        "last": true,
        "totalPages": 1,
        "totalElements": 1
      }
    }
    ```

### 3. Validação do Wizard de Preferências
Para impedir o "cold start" sem interações e garantir que o cálculo de afinidade explicit baseie-se em escolhas reais do usuário, a tela `/preferences` deve validar a seleção em cada etapa.
* **Onboarding Steps**: Existem 5 passos (`gastronomia`, `cultura`, `aventura`, `relaxamento`, `noite`).
* **Hook de Controle (`usePreferencesWizard.js`)**: O hook centraliza a navegação. Adicionaremos uma checagem de validação de categorias/slugs usando a lista obtida por `preferenceService.getCategories()`.
* **Fluxo de validação**:
  1. No carregamento inicial, o hook executa `getCategories()`.
  2. Ao clicar em `handleNext()` ou `handleFinish()`, identificamos o `pillar` ativo no passo corrente.
  3. Filtramos todas as categorias de interesse que pertencem a esse pilar.
  4. Verificamos se o usuário possui pelo menos um desses IDs de interesse na lista `selectedIds`.
  5. Se sim, prosseguimos para o próximo passo. Se não, bloqueamos o avanço exibindo um `Alert.alert` amigável.

---

## Codebase Architecture

### Arquivos Modificados ou Criados

1. **`frontend/package.json`** (Modificado)
   - Adicionar a dependência `"expo-location": "~18.0.4"` (ou a versão instalada por `npx expo install`).
   
2. **`frontend/src/services/useRecommendations.ts`** (Novo)
   - Criar um hook customizado dedicado para gerenciar a chamada de recomendações inteligentes do topo (carrossel) e do feed principal (caso não haja filtros).
   - Deve encapsular o estado de carregamento (`isLoading`), dados de retorno (`recommendations`), refresh, e erro.
   
3. **`frontend/src/hooks/usePreferencesWizard.js`** (Modificado)
   - Carregar catálogo de categorias no `useEffect`.
   - Adicionar validação de pilar ativo antes de avançar de step ou finalizar o questionário.

4. **`frontend/src/app/dashboard/index.tsx`** (Modificado)
   - Integrar `expo-location` para requisitar localização no carregamento inicial (`useEffect`) ou refresh.
   - Alimentar o carrossel horizontal de recomendações com os dados do novo endpoint (até 10 itens).
   - Substituir o feed "Descubra" vertical padrão para renderizar a paginação de recomendações (de 10 em 10). Se filtros manuais forem selecionados, voltar dinamicamente para o feed geral com paginação filtrada.

---

## Validation Architecture

### 1. Testes Automatizados no Frontend (Jest + Expo)
Para validar a integração e as novas lógicas sem regressão, criaremos testes focados em:
* **`usePreferencesWizard.test.js`**: Validar que `handleNext` impede a navegação para o passo 2 se nenhuma categoria do pilar ativo estiver selecionada em `selectedIds`.
* **`useRecommendations.test.ts`**: Mockar a chamada de API do endpoint `/api/v1/attractions/recommendations` e validar o mapeamento correto de retorno de campos (como `distance` e `isPartner`).

### 2. Casos de Teste (UAT / Manuais)
* **Caso 1: Geolocalização Concedida**: Permitir localização nas permissões do simulador/dispositivo. Verificar se o carrossel exibe as distâncias calculadas dinamicamente (ex: `1,2 km`) ao invés do fallback `"Localizando..."`.
* **Caso 2: Geolocalização Negada**: Negar permissão de localização. O carrossel deve renderizar normalmente sem quebrar, ocultando distâncias ou exibindo o texto de fallback.
* **Caso 3: Validação de Passo no Wizard**: Tentar clicar no botão de avançar na tela `/preferences` logo na primeira categoria (Gastronomia) sem selecionar nenhum card de comida. O app deve exibir o alerta "Selecione pelo menos um interesse para continuar." e travar a navegação.
* **Caso 4: Sincronia de Filtros**: Selecionar um filtro de categoria no feed principal (ex: "Praia"). O feed "Descubra" vertical deve mudar instantaneamente para filtrar apenas praias, mesmo que haja recomendações gerais ativas. Ao limpar o filtro de categorias, o feed vertical deve restaurar a ordenação personalizada padrão por recomendações.
