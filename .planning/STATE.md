# State - Sprint 05

## Context
Iniciando a Sprint 05 do Exploraê. Com o Mapa Interativo e o traçado de rotas dinâmicas totalmente funcionais na Sprint 04, e o backend estruturado em Package-by-Feature, focamos agora na mecânica de engajamento presencial. O check-in presencial validado por GPS e a troca de moedas virtuais por vouchers de descontos em estabelecimentos locais trarão a essência da gamificação e parcerias para a plataforma.

## Current Phase
- **Active**: Phase 1 - [SDGEU-250] Criar serviço de verificação física de proximidade no backend
- **Status**: ⌛ Ready to discuss.

## Recent Progress
- [X] Conclusão da Sprint 04 com entrega do mapa interativo, pinos e callouts personalizados, busca de locais com debounce, roteamento inteligente (OSRM) e Nearest Neighbor.
- [X] Refatoração da arquitetura geral do backend para o formato de Package-by-Feature (removendo pacotes vazios globais de service e repository).
- [X] Execução de testes unitários e de integração, com todos os 49 testes de backend passando sem regressões.

## Session Continuity
- **Last session**: 2026-06-13
- **Stopped at**: Sprint 04 milestone closed, audited and archived.
- **Resume file**: .planning/ROADMAP.md

## Notes
- Definir raio de tolerância adequado para o geofencing do check-in (ex: 50 a 100m).
- Estruturar o banco de dados para parceiros e vouchers com as respectivas chaves estrangeiras e índices para busca rápida.
