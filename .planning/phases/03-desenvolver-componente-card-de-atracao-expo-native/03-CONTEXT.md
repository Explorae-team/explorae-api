# Context - Phase 3: Attraction Card Component

## 🎯 Phase Goal
Criar o componente visual fundamental para o Feed de Atrações (Sprint 03). O card deve ser visualmente rico, seguindo a estética premium do Exploraê, e preparado para consumir dados da API de atrações.

## 📄 Requirements Analysis
- Baseado no showcase HTML fornecido pelo usuário.
- Deve utilizar os tokens de design do Horizon Design System.
- Suporte a variantes: Default (Foco desta fase).
- Tecnologias: Expo, NativeWind, MaterialIcons.

## 🧩 Architectural Decisions
- **Localização**: `src/components/AttractionCard.tsx`.
- **Props**: Passagem explícita de dados (Stateless Component preferencialmente).
- **Estilização**: NativeWind para consistência com o restante do app.

## ⚠️ Risks & Mitigation
- **Performance**: Uso de `expo-image` para lidar com múltiplas imagens no feed futuro.
- **Visual**: Garantir que o efeito de Glassmorphism (blur) nos badges funcione bem no Android (pode exigir fallback de opacidade).
