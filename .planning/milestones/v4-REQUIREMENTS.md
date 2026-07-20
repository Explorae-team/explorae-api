# Requirements - Sprint 04 (Archived Milestone)

## Overview
A Sprint 04 focou no desenvolvimento do Mapa Interativo de Atrações e na exibição em tempo real de atrações turísticas com base no raio de geolocalização do usuário, integrando rotas, busca inteligente de endereços, roteamento dinâmico OSRM e cálculo de distância preciso, além de realizar a refatoração do backend para Package-by-Feature.

## User Stories

### [SDGEU-158] Mapa Interativo de Atrações
**Descrição**: Como um explorador, desejo visualizar as atrações em um mapa interativo em tempo real para encontrar pontos de interesse próximos a mim de forma geo-referenciada.

- **Requisitos Funcionais**:
  - [X] Integrar biblioteca de mapas multiplataforma (React Native Maps).
  - [X] Renderizar pins customizados por categoria no mapa.
  - [X] Permitir filtrar os pins no mapa por categoria e avaliação.
- **Critérios de Aceite**:
  - [X] Exibe a localização em tempo real do dispositivo no mapa.
  - [X] Ao clicar em um pin, exibe um mini-card de atração (Callout) contendo foto, nome e rating, com atalho para tela de detalhes completos.
  - [X] Suporta cálculo e traçado de rota em tempo real via API OSRM (carro, caminhada, ônibus).
  - [X] Input de busca inteligente com debounce de 400ms integrado ao mapa, permitindo autocompletar destinos e traçar rotas direto do resultado.
  - [X] Algoritmo Nearest Neighbor para ordenação inteligente dos pontos turísticos a partir de um destino inicial.

### [SDGEU-REF-1] Refatoração da Arquitetura do Backend
**Descrição**: Como arquiteto/desenvolvedor de software, desejo organizar o backend utilizando a estrutura Package-by-Feature para melhorar a coesão, acoplamento e escalabilidade do projeto.

- **Requisitos Funcionais**:
  - [X] Mapear e migrar os pacotes globais `repository` e `service` redundantes e vazios para dentro das respectivas features (`attraction`, `gamification`, `user`).
  - [X] Resolver quaisquer problemas de compilação ou importação quebrados.
  - [X] Garantir que todos os testes unitários e de integração de backend passem com sucesso.
- **Critérios de Aceite**:
  - [X] Nenhuma pasta global vazia de repositório ou serviço redundante permanece no projeto.
  - [X] Toda a suite de testes Maven (`mvn test`) executa com sucesso.
