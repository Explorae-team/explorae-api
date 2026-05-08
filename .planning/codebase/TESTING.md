# Testing

## Backend Testing
- **Framework**: [JUnit 5](https://junit.org/junit5/) and [AssertJ](https://assertj.github.io/doc/).
- **Mocking**: [Mockito](https://site.mockito.org/).
- **Integration Tests**: `@SpringBootTest` with `@AutoConfigureMockMvc`.
- **Current Coverage**:
  - Exception handling (`GlobalExceptionHandlerTest`).
  - Backlog includes expanding coverage for services and repositories.

## Frontend Testing
- **Framework**: [Jest](https://jestjs.io/).
- **Library**: [React Testing Library](https://testing-library.com/docs/react-native-testing-library/intro/) (Native version).
- **Environment**: `jest-expo` preset.
- **Current Coverage**:
  - Authentication flow (`auth.test.js`).
  - Login screen (`login.test.tsx`).

## Quality Gates
- **Linting**: ESLint on the frontend.
- **Verification**: Tests are expected to pass before merging into the `develop` branch.
