# UI-SPEC Phase 05: Home (Explore Screen)

## 🎨 Design Vision
The Explore screen is the central hub of the application. It must feel premium, alive, and rewarding. It combines discovery (attractions) with progression (gamification).

## 💎 Design Tokens (Extracted from Reference)
- **Background**: `#00161e` (Surface)
- **Primary Color**: `#ffb598` (Primary)
- **Accent Color**: `#fd6c28` (On-Primary-Container / Highlights)
- **Progress/XP Color**: `#ffba26` (Tertiary)
- **Surface High**: `#002e3c`
- **Surface Bright**: `#0d3e4e` (Glass effect base)

## 🧩 Components to Implement

### 1. `ExploreHeader`
- **Role**: Branding and user profile access.
- **Features**: 
  - Logo "Exploraê" (Image asset).
  - Profile avatar with `#002e3c` background and border.

### 2. `UserProgressHero`
- **Role**: Show current level and XP.
- **Features**:
  - User name in `text-3xl font-extrabold`.
  - Level badge in `tertiary-container` with icon `military_tech`.
  - XP progress bar with tertiary color and glow effect.

### 3. `AttractionCard` (Core Component)
- **Variants**:
  - **Compact**: Used in horizontal carousels. Smaller image (h-28), title, and basic distance/type info.
  - **Default**: Used in vertical feed. Full features: Image (h-48), Badges (Popular/Novo), Heart button, Title, Rating, Tagline, and Info Row (Duration, Distance, Visitor Count).
- **Style**: Rounded-3xl, shadow-sm, border-outline-variant/10.

### 4. `DiscoverSection` (Vertical Feed)
- **Role**: Main discovery area.
- **Features**:
  - Header: "Descubra" title (font-black, uppercase) + "Filtros" button.
  - **Pagination**: 5 items per page.
  - **Load More**: "Mostrar mais atrações" button at the end of the current page.
  - **End of List State**:
    - "You reached the end" icon (route) and message.
    - CTA: "VER MAIS NO MAPA" button.

### 5. `AppFooter` (Shared Navigation)
- **Role**: Main app hub.
- **Items**: 
  - **Routes**: Map icon.
  - **Explore**: Explore icon (Active state).
  - **Search (FAB)**: Large central button with primary color and shadow.
  - **Coupons**: Rewards icon.
  - **Profile**: Person icon.
- **Style**: Relative positioning, glassmorphism blur (bg-surface/40), and elevation shadow.

## 🧪 Visual Acceptance Criteria (UAT)
1. **Pagination (5x5)**: The vertical list must start with 5 items, and show +5 each time "Ver Mais" is pressed until the end.
2. **Badges**: "Popular" and "Novo" badges must appear based on logic (e.g., popularity score or date).
3. **Typography**: Use `Inter` font family as specified.
4. **Animations**: Smooth scaling on press for all interactive cards and buttons.
5. **Dark Mode**: Strictly dark theme as per the reference.
