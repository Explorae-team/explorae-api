# Conventions

## Coding Standards
- **Backend**:
  - Follow standard Java/Spring Boot conventions.
  - Use Lombok for getters, setters, and constructors.
  - Prefer Constructor Injection over `@Autowired`.
  - Use MapStruct for all Entity-DTO conversions.
- **Frontend**:
  - Use functional components and Hooks.
  - Prefer TypeScript for new components (migration in progress).
  - Use NativeWind for styling to keep consistency with TailwindCSS patterns.

## Communication Patterns
- **API Responses**: Always wrap responses in `StandardResponseDTO`.
- **Naming**: 
  - CamelCase for Java classes and JavaScript variables.
  - PascalCase for React components.
  - snake_case for database columns (via JPA/Hibernate default or explicit mapping).

## Project Specific Rules
- **Commits**: Messages must be in **Portuguese**, following the pattern: `prefixo: mensagem` (e.g., `feat: adiciona login`).
- **Gamification**: 
  - Level up formula: `próximo nível = nível atual * 500 XP`.
  - Database integrity: Use `ON DELETE CASCADE` for gamification relationships.

## Documentation
- Keep `GEMINI.md` updated with the latest project status and backlog.
- Add "why" comments for complex logic instead of just "what".
