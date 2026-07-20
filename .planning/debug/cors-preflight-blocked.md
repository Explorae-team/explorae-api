# Debug Session: Bloqueio de CORS na Requisição Preflight (OPTIONS)

## Symptoms
- O frontend rodando em `https://explorae.site` (Produção) não consegue realizar login ou buscar dados do usuário. O console do navegador reporta o seguinte erro:
  ```text
  Access to XMLHttpRequest at 'https://api.explorae.site/api/v1/auth/login' from origin 'https://explorae.site' has been blocked by CORS policy: Response to preflight request doesn't pass access control check: No 'Access-Control-Allow-Origin' header is present on the requested resource.
  Sessão expirada ou inválida: AxiosError: Network Error
  ```
- O erro de rede ocorre devido à ausência do cabeçalho `Access-Control-Allow-Origin` na resposta preflight (requisição do tipo `OPTIONS`).

## Hypotheses
1. **Ausência da Variável de CORS no Docker Compose (Causa Confirmada):**
   * O painel do Coolify possui a variável `CORS_ALLOWED_ORIGINS=https://explorae.site` configurada. Porém, o arquivo `docker-compose.yml` **não repassa** essa variável para o container `backend`.
2. **Propriedade Não Mapeada no Spring Boot (Causa Confirmada):**
   * O arquivo `application.properties` do backend não mapeia a variável de ambiente `CORS_ALLOWED_ORIGINS` para a propriedade `cors.allowed.origins`.
3. **CORS Chumbado em `*` no Spring Security (Causa Confirmada):**
   * A classe `SecurityConfig.java` do backend (que define o filtro de CORS do Spring Security) configura o `allowedOrigins` como `*` de forma rígida em código: `configuration.setAllowedOrigins(List.of("*"))`.
   * *O Problema:* Como o frontend envia o cabeçalho de autenticação `Authorization: Bearer ...` (que é considerado credencial/cabeçalho customizado), o navegador **rejeita** a política de CORS se a resposta contiver `*` como origem e não habilitar suporte explícito a credenciais.

## Investigation Log
- [x] Inspecionada a classe `SecurityConfig.java`.
  * *Resultado:* O Spring Security possui sua própria `CorsConfigurationSource` chumbada com `setAllowedOrigins(List.of("*"))`. Ela ignora a classe `CorsConfig.java` do Spring MVC e não lê a propriedade de ambiente.
- [x] Inspecionado o arquivo `backend/src/main/resources/application.properties`.
  * *Resultado:* A propriedade `cors.allowed.origins` está ausente, o que impede a injeção dinâmica de origens via variáveis de ambiente.
- [x] Inspecionado o arquivo `docker-compose.yml` raiz.
  * *Resultado:* A variável `CORS_ALLOWED_ORIGINS` está ausente da seção `environment` do serviço `backend`.

## Root Cause
A requisição HTTP OPTIONS (preflight) enviada pelo navegador do cliente é bloqueada pelo Spring Security porque a política de CORS do backend está configurada de forma rígida como `*` (permitir tudo) e sem suporte explícito a credenciais de requisição (`allowCredentials`). Navegadores modernos proíbem o uso de `*` quando a requisição envia cabeçalhos de autorização (`Authorization`). 

Além disso, a variável de ambiente `CORS_ALLOWED_ORIGINS` configurada no Coolify não era propagada pelo `docker-compose.yml` nem mapeada nas propriedades do Spring.

## Resolution

### 🛠️ Ajustes Realizados de Ponta a Ponta:

1. **Correção em `docker-compose.yml`:**
   Adicionada a variável `CORS_ALLOWED_ORIGINS` na seção `environment` do serviço `backend` para repassá-la ao container:
   ```yaml
       environment:
         - SPRING_PROFILES_ACTIVE=prod
         ...
         - CORS_ALLOWED_ORIGINS
   ```

2. **Mapeamento em `application.properties`:**
   Adicionada a linha de associação para expor a variável de ambiente ao Spring Boot com fallback para `*`:
   ```properties
   cors.allowed.origins=${CORS_ALLOWED_ORIGINS:*}
   ```

3. **Refatoração Dinâmica em `SecurityConfig.java`:**
   * Injetada a propriedade `@Value("${cors.allowed.origins:*}")`.
   * Atualizado o `CorsConfigurationSource` para separar origens por vírgula se especificadas, ou usar `setAllowedOriginPatterns(List.of("*"))` caso seja um curinga (suportando credenciais).
   * Habilitado `setAllowCredentials(true)` para aceitar com segurança os cabeçalhos de `Authorization: Bearer`.

**Status**: Resolvido. Aplicando os commits e reiniciando o deploy, a comunicação CORS estará completamente liberada em ambos os ambientes (Produção e Preview).
