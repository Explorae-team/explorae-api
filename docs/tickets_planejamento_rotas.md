# SDGEU-159: Planejamento de Rotas e Navegação (User Story Pai)

**User Story:**
Como turista, quero criar uma rota otimizada entre múltiplas atrações turísticas para que eu possa visitar vários lugares de forma eficiente e sem desorientação.

**Critérios de Aceitação Gerais:**
1. O usuário deve ser capaz de adicionar até 10 pontos de interesse (atrações) em uma única rota.
2. A tela deve exibir o tempo total estimado e a distância total do trajeto.
3. Deve haver um seletor visual com três opções de transporte: a pé (caminhada), transporte público e carro/por aplicativo (Uber/99).
4. O traçado do caminho deve ser desenhado sobre o mapa.

---

## Detalhamento das Subtarefas para a Sprint 4

### [SDGEU-231] [S4-P1-T3] Criar API de Cálculo de Rota e Tempo (Backend - Spring Boot)
*   **Responsável sugerido:** Backend Developer
*   **Descrição:**
    Desenvolver o serviço no backend que consome a API de Directions (ex: Google Directions API ou open-source como OSRM) para calcular a rota ideal entre múltiplos pontos e estimar tempos/distâncias por modal de transporte.
*   **Passos Técnicos:**
    1. Criar a estrutura do serviço `RouteService` e o DTO correspondente para receber a lista de pontos geográficos (coordenadas de origem, destino e waypoints).
    2. Integrar a chamada externa de forma segura mascarando a API Key no backend.
    3. Tratar as respostas de erro da API externa (limites de cota, rotas impossíveis) e formatar o retorno padronizado para o frontend.
*   **Critérios de Aceite:**
    *   [ ] Endpoint `/api/v1/routes/calculate` criado e operacional.
    *   [ ] Retorna com sucesso a lista compactada de pontos geométricos (Polylines) para o frontend desenhar.
    *   [ ] Retorna corretamente a distância total (metros/km) e tempo estimado (segundos/minutos) para os modais selecionados.

---

### [SDGEU-239] [S4-P2-T3] Renderizar Traçado de Rota (Polyline) no Mapa (Frontend - Expo/Native)
*   **Responsável sugerido:** Frontend Developer
*   **Descrição:**
    Integrar o desenho gráfico do trajeto no mapa nativo utilizando as coordenadas poligonais retornadas pela API e garantir a atualização dinâmica.
*   **Passos Técnicos:**
    1. Utilizar o componente `<MapView.Polyline>` ou `react-native-maps-directions`.
    2. Decodificar as polylines recebidas da API do backend em um array de coordenadas lat/lng legíveis para o componente do mapa.
    3. Ajustar o enquadramento da câmera (`fitToCoordinates`) para exibir a rota completa na tela ao carregá-la.
*   **Critérios de Aceite:**
    *   [ ] O traçado da rota é renderizado sobre as vias do mapa com cor visível e nítida.
    *   [ ] O mapa se autoajusta para enquadrar o ponto inicial, os intermediários e o final.

---

### [SDGEU-241] [S4-P3-T1] Implementar Seletor de Meio de Transporte (Frontend - Expo/Native)
*   **Responsável sugerido:** Frontend Developer
*   **Descrição:**
    Criar a interface do seletor de transporte (a pé, transporte público, carro) e implementar a lógica que dispara uma nova requisição de rota ao alterar a seleção.
*   **Passos Técnicos:**
    1. Desenvolver um componente de controle segmentado ou abas (`Tabs`) com ícones representativos (caminhada, ônibus, carro).
    2. Atualizar o estado da aplicação e disparar a consulta ao backend passando o novo parâmetro de transporte (`mode=walking`, `mode=transit`, `mode=driving`).
    3. Exibir o tempo estimado atualizado ao lado de cada ícone.
*   **Critérios de Aceite:**
    *   [ ] Componente visual responsivo e amigável.
    *   [ ] Alterar o meio de transporte atualiza instantaneamente o traçado da rota e os tempos estimados na tela.

---

### [SDGEU-243] [S4-P3-T2] Criar API de Histórico de Rotas Realizadas (Backend - Spring Boot)
*   **Responsável sugerido:** Backend Developer
*   **Descrição:**
    Modelar e implementar no banco de dados a persistência das rotas que foram iniciadas/concluídas pelo usuário para fins de histórico e gamificação.
*   **Passos Técnicos:**
    1. Criar a entidade `RouteHistory` com relacionamento `@ManyToOne` com o usuário, registrando data, pontos de parada, distância percorrida e modal.
    2. Desenvolver a migração do Liquibase para criação da tabela correspondente.
    3. Criar os endpoints `/api/v1/routes/history` (GET para listar e POST para gravar nova entrada).
*   **Critérios de Aceite:**
    *   [ ] Registro de nova rota no histórico funcionando via POST com retorno `201 Created`.
    *   [ ] Listagem paginada de histórico retornando dados corretamente ordenados por data decrescente.

---

### [SDGEU-245] [S4-P3-T3] Integrar Fluxo de Início de Rota com Histórico e Analytics (Frontend/Backend Integration)
*   **Responsável sugerido:** Frontend/Backend Integration
*   **Descrição:**
    Finalizar o ciclo de vida da rota conectando o botão "Iniciar Rota" do app mobile aos sistemas de persistência de histórico e disparo de eventos analíticos de comportamento.
*   **Passos Técnicos:**
    1. Ao clicar em "Iniciar", disparar requisição POST para registrar a rota no histórico de rotas do usuário no backend.
    2. Integrar gatilhos para rastrear métricas de engajamento do usuário (por exemplo, disparar eventos internos ou logs de início de jornada).
    3. Integrar com o sistema de gamificação para atribuir pontos/XP caso o usuário atinja metas de exploração ou rotas sustentáveis (ODS).
*   **Critérios de Aceite:**
    *   [ ] O backend registra a rota em tempo de execução ao clicar no botão.
    *   [ ] O usuário recebe uma confirmação visual (ex: contagem de XP atualizada) se o fluxo de gamificação for engajado com a rota.
