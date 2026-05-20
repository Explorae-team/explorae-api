# SCRATCH - Phase 6

## Notas e Ideias
- Talvez usar `react-native-modal-datetime-picker` se decidirmos filtrar por horário de funcionamento real no modal de filtros.
- O slider de distância pode ser um componente customizado ou usar o `Slider` da comunidade.
- Considerar o uso de `BlurView` do Expo no Modal para o efeito de glassmorphism premium.

## Estrutura do Estado de Filtro (Preview para Phase 7)
```typescript
interface FilterState {
  searchQuery: string;
  category: string | null;
  distance: number; // km
  priceRange: number[]; // [1, 2, 3]
  minRating: number;
  openNow: boolean;
}
```
