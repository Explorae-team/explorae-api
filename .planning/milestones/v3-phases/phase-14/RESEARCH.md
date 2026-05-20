# Research: Phase 14 - Unit & Integration Tests (Feed)

## Test Surfaces

### 1. Backend (Spring Boot)
- **AttractionController**: Integration tests (MockMvc) to verify pagination and standard response format.
- **AttractionService**: Unit tests to verify business logic (mapping, etc).
- **AttractionRepository**: DataJpaTests (H2) to verify query behavior if needed (though it's standard currently).

### 2. Frontend (React Native/Expo)
- **useExploreData**: Test the hook's state transitions (loading, success, error, pagination).
- **AttractionCard**: Component testing (interaction, rendering variants).
- **ExploreScreen**: Snapshot/Integration tests of the feed area.

## Existing Test Infrastructure
- Backend uses `spring-boot-starter-test` and `h2` for database tests.
- Frontend: Needs checking if `jest` and `react-native-testing-library` are configured.

## Strategy
- Vertical slice testing: Ensure the full flow from API to Component rendering is covered.
- Focus on the "Ver mais" (pagination) logic which was a pain point.
