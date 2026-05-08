# Tech Stack

## Backend
- **Core Framework**: [Spring Boot 4.0.3](https://spring.io/projects/spring-boot)
- **Language**: Java 25
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **Migrations**: [Liquibase](https://www.liquibase.org/)
- **ORM**: Spring Data JPA / Hibernate
- **Security**: Spring Security with JWT (jjwt 0.12.6)
- **Utilities**: 
  - [Lombok](https://projectlombok.org/) for boilerplate reduction
  - [MapStruct](https://mapstruct.org/) for entity-DTO mapping
- **Validation**: Spring Boot Starter Validation (Bean Validation / Hibernate Validator)

## Frontend
- **Framework**: [Expo](https://expo.dev/) (React Native)
- **Core**: React 19.2.0
- **Routing**: [Expo Router](https://docs.expo.dev/routing/introduction/)
- **Styling**: [NativeWind](https://www.nativewind.dev/) (TailwindCSS for React Native)
- **HTTP Client**: [Axios](https://axios-http.com/)
- **State Management**: React Context API (AuthContext)
- **Utilities**: 
  - `expo-secure-store` for token storage
  - `react-native-reanimated` for animations

## Infrastructure
- **Containerization**: [Docker](https://www.docker.com/) & Docker Compose
- **Build Tools**: 
  - Maven (Backend)
  - NPM (Frontend)
