---
phase: 10
slug: exibir-carrossel-recomendacoes-feed
status: draft
shadcn_initialized: false
preset: none
created: 2026-05-20
---

# Phase 10 — UI Design Contract

> Visual and interaction contract for frontend phases.

---

## Design System

| Property | Value |
|----------|-------|
| Tool | none (TailwindCSS / NativeWind) |
| Preset | not applicable |
| Component library | none (Native components, MaterialIcons) |
| Icon library | @expo/vector-icons (MaterialIcons, MaterialCommunityIcons) |
| Font | Outfit / Inter (Google Fonts) |

---

## Spacing Scale

Declared values (must be multiples of 4):

| Token | Value | Usage |
|-------|-------|-------|
| xs | 4px | Gaps do rating star, mini padding |
| sm | 8px | Espaçamento interno de cards, mini gaps |
| md | 16px | Padding interno de AttractionCard, margens |
| lg | 24px | Gaps de seções, padding horizontal do feed (px-6) |
| xl | 32px | Distância entre seções verticais principais |
| 2xl | 48px | Espaçamento do rodapé |
| 3xl | 64px | Page-level top padding |

Exceptions: none

---

## Typography

| Role | Size | Weight | Line Height |
|------|------|--------|-------------|
| Body | 14px | Normal (400) | 20px |
| Label | 12px | Bold (700) | 16px |
| Heading | 18px | Bold (700) | 24px |
| Display | 24px | ExtraBold (800) | 32px |

---

## Color

| Role | Value | Usage |
|------|-------|-------|
| Dominant (60%) | `#00161e` | Fundo principal da página (bg-surface) |
| Secondary (30%) | `#002e3c` | Fundo dos cards (`AttractionCard`) e modais |
| Accent (10%) | `#fd6c28` | Estrelas de rating, botão primário CTA, links, filtros ativos |
| Destructive | `#ef4444` | Ícones de erro, alertas de rede, desativações |

Accent reserved for: Estrelas de avaliação, botões de ação ("Mostrar mais", "Filtros"), botões de favoritos e indicadores de passos ativos.

---

## Copywriting Contract

| Element | Copy |
|---------|------|
| Primary CTA | "Mostrar mais atrações" |
| Secondary CTA | "VER MAIS NO MAPA" |
| Section Title (Carousel) | "Recomendado para você" |
| Section Title (Feed) | "Descubra" |
| Empty state heading | "Você chegou ao fim por agora" |
| Empty state body | "Mas a cidade é enorme! Que tal buscar por regiões específicas no mapa?" |
| Error state | "Não foi possível carregar as atrações. [Tentar novamente]" |

---

## Registry Safety

| Registry | Blocks Used | Safety Gate |
|----------|-------------|-------------|
| none | none | not required |

---

## Checker Sign-Off

- [ ] Dimension 1 Copywriting: PASS
- [ ] Dimension 2 Visuals: PASS
- [ ] Dimension 3 Color: PASS
- [ ] Dimension 4 Typography: PASS
- [ ] Dimension 5 Spacing: PASS
- [ ] Dimension 6 Registry Safety: PASS

**Approval:** pending
