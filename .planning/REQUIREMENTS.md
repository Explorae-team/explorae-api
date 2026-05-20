# Requirements - Sprint 04

## Overview
A Sprint 04 focará no desenvolvimento do Mapa Interativo de Atrações e na exibição em tempo real de atrações turísticas com base no raio de geolocalização do usuário, integrando rotas e cálculo de distância preciso.

## User Stories

### [SDGEU-158] Mapa Interativo de Atrações
**Descrição**: Como um explorador, desejo visualizar as atrações em um mapa interativo em tempo real para encontrar pontos de interesse próximos a mim de forma geo-referenciada.

- **Requisitos Funcionais**:
  - [ ] Integrar biblioteca de mapas multiplataforma (React Native Maps).
  - [ ] Renderizar pins customizados por categoria no mapa.
  - [ ] Permitir filtrar os pins no mapa por categoria e avaliação.
- **Critérios de Aceite**:
  - [ ] Exibe a localização em tempo real do dispositivo no mapa.
  - [ ] Ao clicar em um pin, exibe um mini-card de atração (Callout) contendo foto, nome e rating, com atalho para tela de detalhes completos.
  - [ ] Carrega automaticamente novos pins ao arrastar/mover o centro geográfico do mapa (Lazy Loading espacial).
