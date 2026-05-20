# State - Sprint 03

## Context
Iniciando a Sprint 03 do Exploraê. O backend está funcional com Auth e Preferências. O frontend está com fluxo de onboarding estável. Agora o foco é o conteúdo: Atrações, Feed e Recomendação.

## Current Phase
- **Active**: Phase 10 - [SDGEU-377] Exibir Carrossel de Recomendações no Feed (Expo/Native)
- **Status**: Pronto para iniciar planejamento (discuss-phase).

## Recent Progress
- [X] Phase 9: Algoritmo de recomendação híbrido concluído no backend, com suporte à persistência de interações (VIEW) e cobertura total de testes de integração.
- Concluída a revisão de progresso real da Sprint 03.
- Identificado que as Fases 12 (Galeria de Fotos/Carousel) e 14 (Infraestrutura Terraform OCI) já estão concluídas.
- Concluída Sprint 02 (Perfil e Preferências).
- Organizada estrutura da Sprint 03 a partir do Jira.
- [X] Phase 3: Implementado componente `AttractionCard` com testes unitários.
- [X] Phase 4: API de Listagem Paginada concluída.
- Criado `AttractionResponseDTO` com mapeamento de entidade.
- Implementado `AttractionService` com suporte a `Pageable`.
- Criado `AttractionController` com endpoint `/api/v1/attractions`.
- Configurada segurança para acesso público ao endpoint de listagem.
- Criado teste de integração para o controller.

## Notes
- Manter a sincronia entre Backend (Entidades) e Frontend (Componentes) na Wave 1.
- O algoritmo de recomendação (Phase 10) depende da Phase 1 (Entidade) e dados de preferência já existentes.
- Usar `StandardResponseDTO` para os novos endpoints de atrações.
