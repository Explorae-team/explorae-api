# Plan: Phase 14 - Unit & Integration Tests (Feed)

## Objective
Implement comprehensive automated tests for the attraction feed feature, covering both backend API and frontend component logic.

## Tasks

### 1. Backend Testing
- [ ] **Task 1.1**: Create `AttractionControllerTest` to verify `GET /api/v1/attractions` with pagination.
- [ ] **Task 1.2**: Create `AttractionServiceTest` to verify mapping and repository interaction.
- [ ] **Task 1.3**: Ensure tests run with H2 database in a clean state.

### 2. Frontend Testing
- [ ] **Task 2.1**: Create unit tests for `useExploreData` hook using `@testing-library/react-native`.
- [ ] **Task 2.2**: Create component tests for `AttractionCard` verifying different variants (Default vs Compact).
- [ ] **Task 2.3**: Verify "Ver mais" button behavior in a mock integration test.

### 3. Verification
- [ ] **Task 3.1**: Run `mvn test` in backend.
- [ ] **Task 3.2**: Run `npm test` in frontend.

## Success Criteria
- All tests passing.
- Minimum 80% coverage on new Feed-related classes/components.
- Verified pagination logic (page size, last page detection).
