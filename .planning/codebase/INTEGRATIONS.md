# Integrations

## Frontend <-> Backend
- **Protocol**: REST API over HTTP/HTTPS.
- **Data Format**: JSON.
- **Authentication**: JWT (JSON Web Token).
  - Token is stored in `expo-secure-store` on the frontend.
  - Injected into request headers via Axios interceptors (`Authorization: Bearer <token>`).
- **Error Handling**: Standardized via `StandardResponseDTO` on the backend and Axios interceptors on the frontend.

## External Services
- **Database**: PostgreSQL (self-hosted/containerized).
- **Storage**: Local file storage implementation (`LocalFileStorageService`) on the backend for media assets.

## CI/CD / DevOps
- **Docker Compose**: Orchestrates backend, database, and potentially other services.
- **Environment Variables**: Managed via `.env` files (frontend uses `EXPO_PUBLIC_` prefix).
