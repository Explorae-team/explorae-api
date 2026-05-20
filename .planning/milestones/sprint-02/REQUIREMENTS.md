# Requirements: Exploraê - Sprint 02

**Defined:** 2026-05-08
**Core Value:** Personalização da experiência turística através de perfis detalhados e recomendações inteligentes.

## v1 Requirements (Sprint 02)

### Gestão de Perfil (Profile Management)
- [x] **PROF-01**: Usuário pode visualizar seus dados (nome, bio, foto) via `GET /users/me`
- [x] **PROF-02**: Usuário pode editar nome e bio via `PUT /users/me`
- [x] **PROF-03**: Sistema fornece feedback visual (sucesso/erro) ao salvar alterações de perfil
- [x] **PROF-04**: Usuário pode selecionar e fazer upload de avatar via `POST /users/me/avatar`
- [x] **PROF-05**: Sistema valida formato e tamanho da imagem no upload de avatar

### Preferências Turísticas & Onboarding
- [x] **TRAV-01**: Entidade `TravelPreference` validada com campo de interesses
- [x] **TRAV-02**: Endpoint `PUT /users/me/preferences` para salvar preferências (interesses)
- [x] **TRAV-03**: Endpoint `GET /users/me/preferences` para consultar preferências
- [x] **TRAV-04**: Interface no Expo para coletar interesses turísticos
- [x] **TRAV-05**: Redirecionamento automático para Onboarding no primeiro acesso após cadastro
- [x] **TRAV-06**: Prevenção de re-exibição do onboarding para usuários que já completaram o fluxo

## Out of Scope
| Feature | Reason |
|---------|--------|
| Algoritmo de Recomendação | Escopado para Sprint 3 |
| Edição de preferências pós-onboarding | Implementado na Phase 10 |
| Moderação automática de imagens | Fora do escopo do MVP |
| Suporte a múltiplas fotos | Fora do escopo do MVP |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| TRAV-01 | Phase 1 (SDGEU-192) | Done |
| TRAV-02 | Phase 2 (SDGEU-191) | Done |
| TRAV-03 | Phase 2 (SDGEU-191) | Done |
| TRAV-04 | Phase 3 (SDGEU-193) | Done |
| PROF-01 | Phase 8 (SDGEU-203) | Done |
| PROF-02 | Phase 9 (SDGEU-204) | Done |
| PROF-03 | Phase 9 (SDGEU-204) | Done |
| TRAV-05 | Phase 3 (SDGEU-193) | Done |
| TRAV-06 | Phase 3 (SDGEU-193) | Done |
| PROF-04 | Phase 9 (SDGEU-204) | Done |
| PROF-05 | Phase 9 (SDGEU-204) | Done |

**Coverage:**
- v1 requirements: 11 total
- Mapped to phases: 11
- Unmapped: 0 ✓

---
*Last updated: 2026-05-08 after Sprint 02 Planning*
