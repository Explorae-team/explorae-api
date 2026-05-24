# SDGEU-158: Mapa Interativo (User Story Pai)

**User Story:**
Como usuário do Exploraê, quero visualizar as atrações turísticas em um mapa interativo para que eu possa planejar meus deslocamentos e passeios visualmente.

**Critérios de Aceitação Gerais:**
1. O mapa deve iniciar centralizado na geolocalização atual do usuário (com permissão ativa) ou no fallback (João Pessoa).
2. Marcadores (Pins) coloridos ou com ícones customizados baseados na categoria da atração.
3. Ao clicar em um marcador, deve deslizar um 'Bottom Sheet' (painel inferior) contendo o resumo da atração (Nome, Imagem, Avaliação, Botão de Direções).
4. O tráfego de APIs de mapas e geocodificação deve ser seguro e mascarado pelo backend.

---

## Detalhamento das Subtarefas para a Sprint 4

### [SDGEU-229] [S4-P1-T4] Implementar Proxy de Geolocalização e Segurança de API Keys (Backend)
*   **Responsável sugerido:** Backend Developer
*   **Descrição:**
    Configurar o backend para servir como um Gateway/Proxy para chamadas de geolocalização e mapas (ex: Google Maps API, Mapbox ou Nominatim), protegendo chaves de API restritas de exposição direta no código cliente (Frontend).
*   **Passos Técnicos:**
    1. Criar um controller `/api/v1/geo/proxy` para receber coordenadas e pesquisar pontos de interesse (POIs) ou calcular distâncias.
    2. Armazenar a API Key no `application.properties`/`application-prod.properties` utilizando variáveis de ambiente seguras.
    3. Implementar um cache local (Redis) para consultas repetidas de geocodificação reversa para evitar gastos de cota.
*   **Critérios de Aceite:**
    *   [ ] O Frontend não faz chamadas diretas a APIs de terceiros com chaves expostas no código.
    *   [ ] Requisições no endpoint de proxy retornam as informações formatadas corretas.
    *   [ ] Chaves de desenvolvimento não sobem para o GitHub em texto aberto.

---

### [SDGEU-233] [S4-P1-T2] Desenvolver Tela de Mapa com Centralização Automática (Frontend)
*   **Responsável sugerido:** Frontend Developer (Mobile/Expo)
*   **Descrição:**
    Criar a tela de visualização do mapa base no ecossistema Expo Router, gerenciar a requisição de permissão de geolocalização nativa do dispositivo e posicionar o zoom inicial nas coordenadas do usuário.
*   **Passos Técnicos:**
    1. Criar a rota da tela `/mapa` ou integrar na aba da dashboard.
    2. Utilizar `expo-location` para solicitar permissões de localização (Foreground).
    3. Caso a permissão seja negada ou falhe, utilizar as coordenadas de João Pessoa-PB como fallback padrão.
*   **Critérios de Aceite:**
    *   [ ] Ao acessar a tela, o dispositivo solicita permissão de localização.
    *   [ ] O mapa centraliza automaticamente na posição GPS do celular.
    *   [ ] Fallback geográfico funcionando caso a permissão seja negada.

---

### [SDGEU-369] [S4-P1-T1] Integrar Biblioteca de Mapas (Native/Expo)
*   **Responsável sugerido:** Frontend Developer (Mobile/Expo)
*   **Descrição:**
    Instalar, configurar e inicializar a biblioteca de renderização de mapas nativos (`react-native-maps`) garantindo compatibilidade entre as plataformas Android (Google Maps SDK) e iOS (Apple Maps).
*   **Passos Técnicos:**
    1. Instalar `react-native-maps` usando o Expo SDK (`npx expo install react-native-maps`).
    2. Configurar o arquivo `app.json` com as permissões e dependências para gerar os builds.
    3. Testar a renderização do mapa básico no Emulador/Aparelho Físico.
*   **Critérios de Aceite:**
    *   [ ] O mapa renderiza sem travamento ou telas cinzas.
    *   [ ] Os controles básicos do mapa (zoom, rotação) respondem ao toque.

---

### [S4-P1-T1] Modelar Geolocalização no Banco de Dados (Backend)
*   **Responsável sugerido:** Backend Developer / Database Specialist
*   **Descrição:**
    Adaptar a tabela de `Attraction` no banco de dados para suportar busca espacial (Latitude e Longitude) e criar os scripts do Liquibase.
*   **Passos Técnicos:**
    1. Adicionar os campos `latitude` (Double) e `longitude` (Double) na entidade `Attraction` (ou usar tipos geométricos nativos do PostgreSQL/PostGIS se necessário).
    2. Atualizar o arquivo de migração do Liquibase para adicionar as colunas.
    3. Atualizar os dados de semente (Seeds) existentes com coordenadas reais de João Pessoa para testes.
*   **Critérios de Aceite:**
    *   [ ] Banco de dados persistindo e recuperando latitude/longitude com sucesso.
    *   [ ] Execução do Liquibase passando limpa.

---

### [SDGEU-237] [S4-P2-T1] Exibir Marcadores Customizados por Categoria no Mapa
*   **Responsável sugerido:** Frontend/Backend Integration
*   **Descrição:**
    Consumir a lista de atrações da API e renderizar pins (marcadores) diferenciados na tela de acordo com a categoria da atração (Ex: ícone de garfo/faca para Gastronomia, árvore para Natureza, etc.).
*   **Passos Técnicos:**
    1. Criar componente `MapMarker` customizado.
    2. Implementar um dicionário de ícones/cores mapeado para cada `Category` vinda do backend.
    3. Mapear o array de atrações retornado da API e instanciar os marcadores no mapa dinamicamente.
*   **Critérios de Aceite:**
    *   [ ] Os pins possuem visual ou cores diferentes que identificam visualmente a categoria da atração.
    *   [ ] Apenas as atrações cadastradas e com coordenadas válidas aparecem no mapa.

---

### [SDGEU-380] [S4-P2-T2] Implementar Bottom Sheet com Resumo da Atração (Expo/Native)
*   **Responsável sugerido:** Frontend Developer
*   **Descrição:**
    Desenvolver o componente de visualização de detalhes rápidos (Bottom Sheet) que é acionado ao clicar em qualquer marcador de atração no mapa.
*   **Passos Técnicos:**
    1. Integrar biblioteca de Bottom Sheet resiliente (Ex: `@gorhom/bottom-sheet` ou implementar animação customizada via `react-native-reanimated`).
    2. Desenhar o card de resumo contendo: foto miniatura, nome da atração, média de avaliações, categoria e um botão "Como Chegar" (que abre o aplicativo de mapas externo).
    3. Controlar o estado para abrir o modal apenas ao interagir com um pin e fechá-lo ao tocar fora.
*   **Critérios de Aceite:**
    *   [ ] O painel desliza suavemente de baixo para cima ao clicar em um marcador.
    *   [ ] Apresenta informações corretas do marcador selecionado.
    *   [ ] O botão "Como Chegar" redireciona para a rota externa (Google Maps / Apple Maps do aparelho).
