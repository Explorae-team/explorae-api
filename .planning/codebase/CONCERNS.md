# Concerns

## Technical Debt
- **Authentication Performance**: Current implementation might require multiple database queries; a planned optimization is to migrate to Claims-based validation in the JWT token (mentioned in `GEMINI.md`).
- **Testing Coverage**: Initial test suites exist, but coverage for core business logic (gamification, attraction management) is still missing.

## Risks
- **Expo Migration**: The project is in the middle of a migration from React Web to React Native (Expo). This can lead to styling inconsistencies or broken routing logic during the transition.
- **Java 25 Adoption**: Being on a very recent Java version (Java 25) might lead to issues with some older libraries if not properly updated.

## Active Backlog (Critical Items)
- **SDGEU-83**: Implementation of XP and level up services.
- **SDGEU-45**: Data seeding for initial attractions.
- **Dockerization**: Completing the `docker-compose.yml` for a full environment setup.

## Architecture Concerns
- **Monorepo Complexity**: As both frontend and backend grow, build times and dependency management might become complex without proper workspace tools (e.g., Turborepo or Nx).
