# Especificação da Stack Tecnológica (STACK.md)

Este documento mapeia todas as tecnologias, dependências e versões utilizadas no monorepo do **Exploraê**, divididas por subprojetos (Backend e Frontend).

---

## ☕ Backend (API REST)

O backend do Exploraê é construído utilizando o ecossistema Spring com a versão mais recente do Java. Ele roda como um serviço isolado de controle de usuários, preferências, catálogo de atrações e gamificação.

### Core Stack
*   **Linguagem:** Java 25 (propriedade `<java.version>25</java.version>` no Maven)
*   **Framework Base:** Spring Boot 4.0.3
*   **Gerenciador de Dependências e Build:** Maven 3.x (com wrapper `mvnw`)

### Dependências Principais (pom.xml)
*   **Acesso a Dados:** `spring-boot-starter-data-jpa` (Hibernate como provedor JPA padrão)
*   **Banco de Dados (Produção/Staging):** PostgreSQL (driver runtime `org.postgresql:postgresql`)
*   **Migração de Banco de Dados:** Liquibase (`org.liquibase:liquibase-core`)
*   **Segurança & Autenticação:** `spring-boot-starter-security` integrado com JSON Web Token (JWT)
*   **Manipulação de JWT:** `io.jsonwebtoken:jjwt-api`, `jjwt-impl`, `jjwt-jackson` (versão `0.12.6`)
*   **Ferramentas de Desenvolvimento:** Lombok para redução de boilerplate e `spring-boot-devtools`
*   **Mapeamento de Entidades/DTOs:** MapStruct (`1.6.3`) para conversão de DTOs
*   **Rate Limiting:** Bucket4j (`8.10.1`) para proteção de endpoints sensíveis (como Login e Registro)
*   **Variáveis de Ambiente:** Dotenv Java (`3.0.2`) para carregar o arquivo `.env` local
*   **Monitoramento:** `spring-boot-starter-actuator` para métricas de saúde (health check)

---

## 📱 Frontend (Expo App)

O frontend é um aplicativo mobile multiplataforma que funciona como PWA (Web) e app nativo (Android/iOS), desenvolvido com Expo e React Native.

### Core Stack
*   **Framework Mobile:** Expo SDK 56
*   **Linguagem:** TypeScript / JavaScript (ES6+ / TypeScript `~6.0.3`)
*   **Framework UI:** React 19.2.3
*   **Engine Nativa:** React Native 0.85.3
*   **Roteamento:** Expo Router `~56.2.6` (sistema de rotas baseadas em arquivos com Typed Routes habilitado)

### Dependências Principais (package.json)
*   **Estilização:** NativeWind `^4.2.3` (Tailwind CSS `^3.4.17` para mobile utilizando `react-native-css-interop`)
*   **Chamadas de API:** Axios `^1.14.0` (configurado com interceptores de IP dinâmico e tokens de autenticação)
*   **Integração com Mapas:** React Native Maps `1.27.2` (utiliza Google Maps no Android/Web e Apple Maps no iOS)
*   **Animações:** React Native Reanimated `4.3.1` (para transições de interface premium e comemorações)
*   **Geolocalização:** `expo-location` (coleta e monitoramento de GPS nativo) e `geolib` (`^3.3.14`) para cálculos trigonométricos de distância em coordenadas terrestres
*   **Armazenamento Local:** `expo-secure-store` (para dados sensíveis como tokens JWT) e `@react-native-async-storage/async-storage` (`2.2.0`)
*   **Mídia & Uploads:** `expo-image-picker` para selecionar fotos de perfil e `@supabase/supabase-js` (`^2.105.4`) para upload e armazenamento em Supabase Storage

---

## 🗄️ Banco de Dados

*   **Produção/Desenvolvimento Local:** PostgreSQL
*   **Versionamento de Schema:** Liquibase (todos os scripts de criação de tabelas e seeds de dados residem sob `backend/src/main/resources/db/changelog`)
*   **IDs das Tabelas:** Padronização completa utilizando UUID v4 gerados de forma nativa pela camada de banco de dados para todas as tabelas primárias.
