# Architecture

## Monorepo
The project is structured as a monorepo to facilitate synchronization between frontend and backend features.

## Backend Architecture
- **Layered Pattern**:
  - **API Layer**: Controllers, DTOs, Mappers, and Global Exception Handling.
  - **Service Layer**: Business logic and service orchestrators.
  - **Repository Layer**: Data access using Spring Data JPA.
  - **Domain Layer**: JPA Entities representing the core business models.
- **Security**: Centralized security configuration with JWT filtering.
- **Consistency**: Uses a `StandardResponseDTO` to wrap all API responses.

## Frontend Architecture
- **Framework**: Expo (React Native) with Expo Router.
- **Routing**: File-based routing located in `src/app`.
- **Component-Driven**: UI is built with reusable components in `src/components`.
- **State Management**: Context API for global state (e.g., Authentication).
- **Service Layer**: Centralized Axios instance for API calls with request/response interceptors.
- **Styling**: Atomic CSS approach using NativeWind (TailwindCSS).

## Data Flow
1. User interacts with UI (React Native).
2. Frontend calls API services (Axios).
3. Backend receives request (Spring Controller).
4. Business logic is processed (Spring Service).
5. Data is persisted/retrieved (JPA Repository -> Postgres).
6. Result is mapped to DTO and returned to Frontend.
7. UI updates based on response.
