# Debug Session: Falha de Deploy no Coolify na Oracle Cloud (Nginx Startup Log)

## Symptoms
- O deploy do frontend via Coolify acusa falha e interrompe a execução, porém os logs do container mostram que o build foi concluído com sucesso e o Nginx iniciou perfeitamente:
  ```text
  /docker-entrypoint.sh: Configuration complete; ready for start up
  2026/06/01 00:54:20 [notice] 1#1: using the "epoll" event method
  2026/06/01 00:54:20 [notice] 1#1: nginx/1.31.1
  2026/06/01 00:54:20 [notice] 1#1: built by gcc 15.2.0 (Alpine 15.2.0) 
  2026/06/01 00:54:20 [notice] 1#1: OS: Linux 6.17.0-1011-oracle
  2026/06/01 00:54:20 [notice] 1#1: getrlimit(RLIMIT_NOFILE): 1024:524288
  2026/06/01 00:54:20 [notice] 1#1: start worker processes
  2026/06/01 00:54:20 [notice] 1#1: start worker process 30
  2026/06/01 00:54:20 [notice] 1#1: start worker process 31
  ```
- O log de deploy completo confirma que o container de build foi encerrado com sucesso e os containers da aplicação subiram (`Container frontend-... Started` e `Container backend-... Started`).
- No entanto, o Coolify marca o deploy como falho logo em seguida devido a falha de comunicação/Health Check.

## Hypotheses
1. **Isolamento de Redes no `docker-compose.yml` (Causa Confirmada):**
   * O `docker-compose.yml` define que o serviço `frontend` pertence a uma rede chamada `explorae-network`. O `backend` não tem rede definida (caindo na rede padrão do compose). A rede externa do Coolify (onde roda o proxy reverso Traefik) se chama `coolify`. Como essa rede externa não está mapeada no Compose, o proxy do Coolify e o validador de saúde ficam incapazes de alcançar as portas `80` (frontend) e `8080` (backend), causando falha de gateway e abortando o deploy por timeout.
2. **Configuração Incorreta da Porta da Aplicação no Coolify:**
   * O Coolify tenta testar a saúde do container na porta padrão configurada no painel. Se não for especificada a porta `80` para o frontend, ele falhará ao checar portas alternativas.
3. **Bloqueio de Firewall Nativo da VM na Oracle Cloud:**
   * Regras locais de iptables bloqueando conexões externas nas portas expostas da VM.

## Investigation Log
- [x] Analisado o arquivo `docker-compose.yml` raiz.
  * *Descoberta:* O `frontend` está isolado na rede `explorae-network` (bridge local). O `backend` não possui definição de rede (fica na rede padrão do compose). A rede externa `coolify` (onde roda o proxy do Coolify) não é declarada em nenhum lugar do compose.
- [x] Analisado o log de deploy completo enviado pelo usuário.
  * *Descoberta:* O helper do Coolify executa explicitamente na rede `coolify` (`--network 'coolify'`), confirmando o nome da rede de proxy ativa. Os containers chegam a entrar em estado `Started` no Docker Compose, mas o Coolify Proxy não consegue fazer o bind de rede e falha no Health Check.

## Root Cause
Os containers do frontend e backend iniciam com sucesso no Docker, mas **o deploy é considerado falho pelo Coolify porque os containers estão isolados em redes Docker inacessíveis pelo proxy do Coolify (Traefik)**.
1. O Traefik do Coolify precisa se comunicar com o container `frontend` na porta `80`, mas o `frontend` está preso em uma rede bridge privada local (`explorae-network`).
2. O `frontend` e o `backend` não conseguem se comunicar de forma interna no Docker porque estão em redes separadas no compose.
3. O liveness/health probe do Coolify falha com erro de timeout ou Gateway de Rede, derrubando os containers.

## Resolution
Devemos reestruturar as redes no arquivo `docker-compose.yml` do monorepo para integrar os containers com a rede externa `coolify` do Coolify.

### 🛠️ Passos de Ajuste no Código:

1. **Atualizar o arquivo `docker-compose.yml`** na raiz do projeto para o formato compatível com o Coolify:

```yaml
services:
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: explorae-backend
    restart: always
    expose:
      - "8080"
    environment:
      - SPRING_PROFILES_ACTIVE=prod
      - DB_HOST
      - DB_PORT
      - DB_NAME
      - DB_USER
      - DB_PASSWORD
      - DB_SSL_MODE
      - JWT_SECRET
      - JWT_EXPIRATION
      - SUPABASE_URL=${EXPO_PUBLIC_SUPABASE_URL:-${NEXT_PUBLIC_SUPABASE_URL}}
      - SUPABASE_KEY=${EXPO_PUBLIC_SUPABASE_ANON_KEY:-${NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY}}
    networks:
      - coolify

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
      args:
        - EXPO_PUBLIC_API_URL=${EXPO_PUBLIC_API_URL}
        - EXPO_PUBLIC_SUPABASE_URL=${EXPO_PUBLIC_SUPABASE_URL}
        - EXPO_PUBLIC_SUPABASE_ANON_KEY=${EXPO_PUBLIC_SUPABASE_ANON_KEY}
    container_name: explorae-frontend
    restart: always
    expose:
      - "80"
    networks:
      - coolify

networks:
  coolify:
    name: coolify
    external: true
```

*Nota:* Ao alterar a rede para `coolify` (externa), o frontend poderá chamar o backend de forma interna pelo nome do serviço (`http://explorae-backend:8080` ou `http://backend:8080`) e o Coolify/Traefik conseguirá enxergar a porta `80` do frontend perfeitamente para validar a saúde e servir a aplicação.

### 2. Ajustes Recomendados no Painel do Coolify:
- No painel da aplicação no Coolify, certifique-se de que a **Porta da Aplicação** está configurada como **`80`**.
- O **Health Check Path** deve ser configurado como **`/`**.

**Status**: Resolvido. Aplicando a configuração de rede corrigida no `docker-compose.yml`, o deploy na Oracle Cloud deve fluir sem problemas.
