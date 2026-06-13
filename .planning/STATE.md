# State - Sprint 06

## Context
Iniciando a Sprint 06 do Exploraê. Com a Sprint 05 (Check-In por Proximidade e ecossistema de Vouchers) totalmente concluída, auditada e em produção, focamos agora na resiliência e no engajamento passivo do usuário. O suporte offline para favoritos e check-ins garantirá usabilidade mesmo em áreas com rede móvel fraca (muito comum em pontos turísticos), enquanto as notificações push baseadas em geofencing em segundo plano atrairão o usuário ativamente para pontos parceiros próximos.

## Current Phase
- **Active**: Phase 1 - [SDGEU-301] Configurar banco de dados local SQLite/WatermelonDB no frontend
- **Status**: ⌛ Ready to discuss.

## Recent Progress
- [X] Conclusão da Sprint 05 com entrega do geofencing de check-in (validação de raio no backend de 50 metros e botão ativo no frontend).
- [X] Fluxo de vouchers e parceiros no backend e frontend, com resgate de moedas, geração de tokens JWT criptografados para o QR Code de validação e tela do scanner para validação física do parceiro.
- [X] Todos os testes unitários e de integração de backend executados com sucesso (BUILD SUCCESS).

## Session Continuity
- **Last session**: 2026-06-13
- **Stopped at**: Sprint 05 milestone closed, audited and archived.
- **Resume file**: .planning/ROADMAP.md

## Notes
- Otimizar consumo de bateria com o monitoramento de geofencing passivo em background no mobile.
- Garantir conciliação de dados ao reativar conexão (conflito de timestamp nos check-ins offline).
