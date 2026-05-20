# Phase 10: Exibir Carrossel de Recomendações no Feed (Expo/Native) - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-05-20
**Phase:** 10-Exibir Carrossel de Recomendações no Feed (Expo/Native)
**Areas discussed:** Geolocalização e Permissões, Prevenção de Perfil Vazio, Volume de Dados e Paginação, Identificação Visual

---

## 📍 Geolocalização & Permissões do Dispositivo

| Option | Description | Selected |
|--------|-------------|----------|
| Opção A | Utilizar `expo-location` para obter permissões reais e enviar ao backend | ✓ (com size=15) |
| Opção B | Não solicitar permissão no MVP e usar fallbacks nulos/padrão | |

**User's choice:** Opção A com limite de 15 registros retornados do endpoint de recomendações.
**Notes:** O frontend solicitará permissão ativamente e enviará as coordenadas caso concedida, permitindo o cálculo real de distância e proximidade.

---

## ❄️ Prevenção de Perfil Vazio (Cold Start)

| Option | Description | Selected |
|--------|-------------|----------|
| Opção A | Substituir o carrossel vazio por atrações mais populares silenciadamente | |
| Opção B | Apresentar um call-to-action explícito para selecionar preferências | |
| **Opção Custom** | Impossibilitar avançar no onboarding sem marcar interesses em cada pilar | ✓ |

**User's choice:** Validação rígida no Wizard de Preferências.
**Notes:** A tela `/preferences` deve garantir que o usuário escolha pelo menos 1 item para *cada uma das categorias de opção* antes de permitir avançar ou concluir o onboarding. Isso elimina o cenário de cold start sem interesses no Dashboard.

---

## 📏 Volume de Dados & Organização do Feed (Carrossel vs Descubra)

| Option | Description | Selected |
|--------|-------------|----------|
| Opção A | Fixo & Leve: carregar apenas 15 atrações recomendadas no carrossel, sem paginação horizontal | ✓ (para o carrossel) |
| Opção B | Horizontal Infinito: paginação horizontal no carrossel superior | |
| **Opção Custom** | Carrossel superior com 15 fixos, feed vertical principal ordenado por recomendações paginado de 10 em 10 | ✓ (para o feed) |

**User's choice:** Carrossel superior estático limitado a 15 e reordenação do feed vertical "Descubra" no fim do dashboard para trazer as recomendações personalizadas em primeiro lugar, paginadas de 10 em 10.
**Notes:** O carrossel horizontal de recomendações traz as 15 principais do usuário. O feed vertical principal ("Descubra") reordena as atrações no mesmo padrão de recomendações (paginado). Quando filtros específicos (categoria, preço, rating) forem aplicados no feed principal, a listagem volta a usar o endpoint geral com filtros.

---

## 🎨 Design do Card e Identificação Visual

| Option | Description | Selected |
|--------|-------------|----------|
| Opção A | Usar o componente `AttractionCard` existente com `variant="compact"`, sem tags adicionais | ✓ |
| Opção B | Criar uma nova variação `variant="featured"` com selos extras de match de afinidade | |

**User's choice:** Opção A.
**Notes:** Não haverá selos ou matches em porcentagem visíveis. A reordenação será natural e sutil. O carrossel superior se identificará unicamente pelo título "Recomendado para você".

---

## the agent's Discretion
- Exibição de skeletons animadores (`AttractionSkeleton`) para carrossel superior e feed vertical durante carregamentos.
- Estruturação do hook customizado para lidar com refresh e estados assíncronos.

## Deferred Ideas
*Nenhuma ideia adiada para fases futuras nesta discussão.*
