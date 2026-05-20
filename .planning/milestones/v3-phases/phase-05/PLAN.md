# Implementation Plan - Phase 05: Home (Explore Screen)

The objective of this phase is to implement the main "Explore" screen of the application, integrating real backend data for attractions and user gamification stats, while following the premium design provided by the user.

## 📋 Pre-requisites
- [x] Backend API for attractions paginated (`GET /api/v1/attractions`).
- [x] `AttractionCard` component implemented in frontend.
- [x] `AuthContext` providing user data (Name, Level, XP).

## 🛠 Proposed Changes

### 1. Frontend: New Components
- **`ExploreHeader`**: Sticky header with logo and profile avatar.
- **`UserProgressHero`**: Hero section displaying name, level, and XP progress bar.
- **`DailyChallengeCard`**: A standalone card for the "Challenge of the Day".
- **`CategoryCarousel`**: Horizontal list for attraction categories.
- **`TopVisitedList`**: Vertical list for the trending attractions.

### 2. Frontend: Data Hook
- **`useExploreData`**: A custom hook to fetch:
  - Paginated attractions (Recommendations).
  - Top 5 most visited attractions.
  - Daily challenge status (mocked for now, or fetched if backend support exists).

### 3. Frontend: Screen Assembly
- **Refactor `frontend/src/app/dashboard/index.jsx`**:
  - Rename to `index.tsx`.
  - Implement the `ScrollView` layout.
  - Compose with the new components.
  - Implement "Pull to Refresh" for updating stats and attractions.

### 4. Styling & Assets
- Update `frontend/tailwind.config.cjs` if new colors/tokens from the HTML are missing.
- Ensure `Inter` font is correctly configured.

## 🛰 API Integration
- `GET /api/v1/attractions?page=0&size=10`: For the recommended feed.
- `GET /api/v1/users/me`: To keep user XP/Level updated.

## 🧪 Verification Plan

### Automated Tests
- Create `ExploreScreen.test.tsx` to verify:
  - User name and XP are displayed correctly.
  - Attraction cards are rendered from the API response.
  - Navigation to attraction details (placeholder for now).

### Manual Verification (UAT)
1. **Visual Fidelity**: Compare the implemented screen with the reference HTML.
2. **Scroll Performance**: Ensure smooth scrolling with multiple components and images.
3. **Data Sync**: Update XP in backend and verify if "Pull to Refresh" updates the UI.
4. **Empty State**: Verify how the screen looks if the API returns no attractions.

## 📦 Deliverables
- [ ] New UI components in `frontend/src/components/`.
- [ ] Updated `Explore` screen in `frontend/src/app/dashboard/index.tsx`.
- [ ] Updated `tailwind.config.cjs`.
