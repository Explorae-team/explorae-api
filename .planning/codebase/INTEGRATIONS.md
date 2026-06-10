# Integrações de Sistemas e Fluxo de Dados (INTEGRATIONS.md)

Este documento descreve as pontes de comunicação e integrações de serviços externos e internos que compõem o ecossistema do **Exploraê**.

---

## 🔗 1. Comunicação Frontend-Backend (Axios REST)

A comunicação entre a aplicação Expo Mobile e a API Spring Boot ocorre por meio de requisições HTTP REST gerenciadas pela biblioteca **Axios**.

*   **Padrão de Resposta:** Todas as respostas da API no backend são encapsuladas em uma estrutura comum chamada `StandardResponseDTO<T>`, contendo metadados de sucesso, erros e dados de paginação.
*   **Gestão de IP Dinâmico:** Para o desenvolvimento local em dispositivos físicos/emuladores, o script `frontend/scripts/update-ip.cjs` é executado antes do início do Expo (scripts `start`, `android`, `ios`, `web`). Ele detecta automaticamente o endereço IPv4 local do computador de desenvolvimento e atualiza a URL base da API no código do frontend, evitando erros de conexão (`Network Error`).
*   **Headers de Segurança:** Um interceptor do Axios anexa automaticamente o cabeçalho `Authorization: Bearer <TOKEN>` nas requisições destinadas a endpoints privados sempre que o usuário possui uma sessão ativa.

---

## 🛡️ 2. Segurança e Autenticação (JWT + Spring Security)

A autenticação é stateless, implementada com tokens JSON Web Token (JWT).

*   **Fluxo de Login/Registro:**
    1. O usuário submete credenciais nos formulários do app móvel.
    2. O backend processa o login na rota pública (`/auth/login`), gera o token JWT usando a biblioteca `jjwt` e assina com a chave privada `JWT_SECRET`.
    3. O frontend recebe o token e o armazena de forma criptografada e segura usando o `expo-secure-store`.
*   **Filtros de Segurança (Backend):**
    *   **JwtAuthenticationFilter:** Intercepta as requisições, valida a assinatura e expiração do token e estabelece o contexto de autenticação no Spring Security (`SecurityContextHolder`).
    *   **RateLimitFilter:** Integrado com `Bucket4j` para prevenir ataques de força bruta, aplicando limites rígidos de requisições por IP a endpoints críticos.

---

## 🗺️ 3. Geolocalização e Serviços de Mapas (Google Maps + Expo Location)

A funcionalidade geo-referenciada é um elemento central para guiar o explorador até as atrações turísticas.

*   **Coleta de Coordenadas:** Utiliza a biblioteca `expo-location` para requisitar permissões do GPS do dispositivo físico (`ACCESS_FINE_LOCATION`, `ACCESS_COARSE_LOCATION`).
*   **Estratégia de Fallbacks:** Caso o usuário recuse as permissões ou esteja emulando num ambiente web sem GPS funcional, o aplicativo ativa automaticamente um fallback geográfico para a cidade de **João Pessoa, PB** para manter a integridade visual do mapa e dos cards do feed.
*   **Renderização do Mapa:** O componente `react-native-maps` renderiza os mapas na tela. As chaves de acesso são lidas de variáveis de ambiente:
    *   `GOOGLE_MAPS_API_KEY` e `EXPO_PUBLIC_GOOGLE_MAPS_API_KEY` são injetadas em tempo de build para habilitar a renderização nativa de mapas do Google.
*   **Cálculo de Proximidade:** Utiliza a biblioteca `geolib` para calcular no lado do cliente a distância exata em metros entre a posição atual do usuário e as coordenadas geográficas de cada atração.

---

## ☁️ 4. Armazenamento em Nuvem (Supabase Storage)

Para o upload e exibição de fotos de perfil (avatares) de usuários e imagens dinâmicas, o projeto integra-se diretamente ao Supabase.

*   **Envio de Mídias:** O frontend usa `expo-image-picker` para abrir a câmera ou galeria do smartphone e obter o URI da imagem selecionada.
*   **SDK Supabase:** A biblioteca `@supabase/supabase-js` realiza a chamada direta aos Buckets de armazenamento do Supabase (`uploads/avatars`).
*   **Segurança:** A integração consome as credenciais públicas do Supabase configuradas em ambiente (`NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`).

---

## 💾 5. Migração de Banco de Dados (Liquibase)

O banco de dados PostgreSQL é completamente automatizado na inicialização do backend.

*   **Liquibase:** Monitora e aplica scripts SQL estruturados em XML/YAML para criar tabelas, índices e restrições.
*   **Seeds Automáticos:** O arquivo de changelog da Liquibase popula o banco de dados de desenvolvimento com um conjunto enriquecido de **105 atrações turísticas** com coordenadas geográficas exatas, categorias, descrições e imagens, garantindo que o catálogo e o mapa já comecem povoados no primeiro build.
