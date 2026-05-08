# Project Structure

## Root Directory
- `/backend`: Spring Boot application source code.
- `/frontend`: Expo (React Native) application source code.
- `/docs`: Project documentation and requirement models.
- `docker-compose.yml`: Infrastructure orchestration.
- `GEMINI.md`: Project status, rules, and backlog.

## Backend Breakdown (`/backend`)
- `src/main/java/br/edu/ifpb/explorae/`:
  - `api/`: REST interface (Controllers, DTOs, Mappers, Exceptions).
  - `service/`: Business logic implementations.
  - `repository/`: Spring Data JPA repositories.
  - `domain/`: JPA Entities (User, Attraction, Gamification).
  - `config/`: Application and security configurations.
- `src/main/resources/`:
  - `db/changelog/`: Liquibase migration files.
  - `application.properties`: Core configuration.

## Frontend Breakdown (`/frontend`)
- `src/`:
  - `app/`: Expo Router screens (login, signup, dashboard).
  - `components/`: UI components (buttons, inputs, cards).
  - `services/`: API client and services.
  - `contexts/`: React Contexts (AuthContext).
  - `styles/`: Global CSS and styling configurations.
  - `utils/`: Utility functions (storage, formatters).
- `assets/`: Static images and resources.
- `__tests__/`: Jest test suites.
