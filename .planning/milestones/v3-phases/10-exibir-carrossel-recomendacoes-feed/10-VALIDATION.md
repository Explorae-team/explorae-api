---
phase: 10
slug: exibir-carrossel-recomendacoes-feed
status: draft
nyquist_compliant: true
wave_0_complete: false
created: 2026-05-20
---

# Phase 10 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Jest / React Testing Library |
| **Config file** | `frontend/jest.config.js` / package.json |
| **Quick run command** | `npm --prefix frontend test -- src/hooks/__tests__/usePreferencesWizard.test.js` |
| **Full suite command** | `npm --prefix frontend test` |
| **Estimated runtime** | ~10 seconds |

---

## Sampling Rate

- **After every task commit:** Run the quick run command to ensure wizard logic isn't broken.
- **After every plan wave:** Run the full frontend test suite.
- **Before `/gsd-verify-work`:** Full suite must be green.
- **Max feedback latency:** 15 seconds.

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 10-01-01 | 01 | 1 | SDGEU-22-FE | — | Bloqueia avanços caso nenhuma categoria do pilar corrente esteja marcada | unit | `npm --prefix frontend test -- usePreferencesWizard` | ❌ W0 | ⬜ pending |
| 10-02-01 | 01 | 1 | SDGEU-377 | — | Mapeia corretamente as distâncias e dados do endpoint `/recommendations` | unit | `npm --prefix frontend test -- useRecommendations` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `frontend/src/hooks/__tests__/usePreferencesWizard.test.js` — unit test suite for wizard category/step selections.
- [ ] `frontend/src/services/__tests__/useRecommendations.test.ts` — test suite for new recommendations hook data mapping.

*If none: "Existing infrastructure covers all phase requirements."*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Permissões de Inicialização (Nativo) | SDGEU-377 | Permissões de hardware de instalação no Mobile | 1. Instale o app no emulador/dispositivo.<br>2. Ao abrir o app pela primeira vez, certifique-se de que ele solicita permissões de **Câmera** E **Geolocalização** de forma ativa. |
| Permissões de Inicialização (Web) | SDGEU-377 | Permissões de navegador na Web | 1. Abra o app pelo navegador Web.<br>2. Ao inicializar o app, certifique-se de que ele solicita **apenas** a permissão de **Geolocalização**, sem pedir câmera. |
| Geolocalização Concedida | SDGEU-377 | Depende de permissão de hardware/SO do dispositivo | 1. No emulador/simulador, autorize a permissão de geolocalização.<br>2. Abra o dashboard.<br>3. Verifique se o carrossel exibe as distâncias em km calculadas de forma dinâmica. |
| Geolocalização Negada (Fallback Jampa) | SDGEU-377 | Depende de recusa de permissão de hardware | 1. No simulador/navegador, recuse a permissão de geolocalização.<br>2. Abra o app.<br>3. Verifique se as atrações são ordenadas por proximidade a **João Pessoa, PB** (por exemplo, atrações do centro de JP aparecem com menor distância e no topo das listagens). |
| Enforcement do Onboarding | SDGEU-22-FE | Depende da navegação de ponta a ponta na UI | 1. Abra o onboarding na tela `/preferences`.<br>2. Tente avançar na categoria de Gastronomia sem selecionar nenhum interesse.<br>3. Verifique se o Alerta é exibido e bloqueia a transição. |
| Sincronia de Filtros | SDGEU-154 | Teste de integração de tela | 1. No Dashboard, clique em uma categoria do carrossel (ex: "Praia").<br>2. O feed "Descubra" deve exibir apenas praias.<br>3. Limpe o filtro. O feed deve voltar para as recomendações personalizadas. |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 15s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
