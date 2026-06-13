# Roadmap

## 🏁 Milestones Arquivados
- **[Sprint 01]**: Setup, Auth & Modelagem Inicial (Concluído)
- **[Sprint 02]**: Perfil & Preferências de Viagem (Concluído)
- **[Sprint 03]**: [Catálogo, Feed & Recomendação Inteligente](file:///.planning/milestones/v3-ROADMAP.md) (Concluído em 2026-05-20)
- **[Sprint 04]**: [Mapa Interativo, Rotas & Refatoração](file:///.planning/milestones/v4-ROADMAP.md) (Concluído em 2026-06-13)
- **[Sprint 05]**: [Check-In por Proximidade & Sistema de Vouchers](file:///.planning/milestones/v5-ROADMAP.md) (Concluído em 2026-06-13)

---

# Roadmap - Sprint 06 (Active Milestone)

## Wave 1: Camada de Abstração de Serviços (LSP/DIP)
- [ ] **Phase 1**: [SDGEU-REF-USER-1] Criar interfaces de serviços para `UserService` e `AuthService` e adequar injeções de dependência no backend.

## Wave 2: Segregação e Divisão do God Service (SRP)
- [ ] **Phase 2**: [SDGEU-REF-USER-2] Extrair lógica de perfil agregado e gamificação de `UserService` para novos serviços específicos (ex: `UserProfileService`).

## Wave 3: Desacoplamento da Camada de Controle e Entidade (SRP/OCP)
- [ ] **Phase 3**: [SDGEU-REF-USER-3] Refatorar `UserController` removendo lógica de negócio residual e injeções acopladas de outras features.
- [ ] **Phase 4**: [SDGEU-REF-USER-4] Limpar a classe de entidade `User` (JPA Entity), isolando validações e mapeamentos.

## Wave 4: Ajuste de Testes e Estabilidade
- [ ] **Phase 5**: [SDGEU-REF-USER-5] Ajustar suite de testes automatizados e validar ausência de regressões no backend.
