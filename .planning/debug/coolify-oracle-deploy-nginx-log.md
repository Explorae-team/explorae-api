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
- O log para após a criação dos processos workers, o que é o comportamento normal e esperado do Nginx rodando em primeiro plano (`daemon off;`), indicando que o container está ativo e saudável, mas o Coolify desiste do deploy.

## Hypotheses
1. **Configuração Incorreta da Porta da Aplicação no Coolify (Causa mais comum):**
   * O Coolify assume por padrão uma porta (ex: `3000` para NodeJS) se nenhuma for configurada explicitamente. Como o `frontend/Dockerfile` expõe a porta `80` e o `nginx.conf` escuta na `80`, se a porta configurada no Coolify estiver incorreta, a validação de liveness/health check falhará, fazendo o Coolify derrubar o container ativo e reportar erro no deploy.
2. **Bloqueio de Firewall Nativo da VM na Oracle Cloud (Host OS Firewall):**
   * As instâncias Always Free da Oracle Cloud (Oracle Linux ou Ubuntu) possuem regras de firewall locais (`iptables` / `firewalld`) extremamente restritivas por padrão. Elas bloqueiam qualquer tráfego externo nas portas expostas (como a `80` ou `443`) ou impedem que o proxy do Coolify (Traefik) estabeleça comunicação externa/interna com as portas expostas pelo Docker.
3. **Caminho de Health Check Incorreto:**
   * Se o Coolify estiver configurado para fazer requisições de Health Check em uma rota específica que não existe no frontend estático (exemplo: `/health` ou `/api/status`), o Nginx retornará `404 Not Found` (redirecionado para `index.html` pelo `try_files` no `nginx.conf`). Se o Coolify esperar estritamente um código `HTTP 200` e não aceitar redirecionamento/outras rotas, o deploy falhará.

## Investigation Log
- [x] Analisado o `frontend/Dockerfile` e constatado que a porta exposta é a `80` (`EXPOSE 80`) com imagem runtime baseada em `nginx:alpine`.
- [x] Analisado o `frontend/nginx.conf` e constatado que o Nginx escuta na porta `80` (`listen 80;`) e serve arquivos estáticos de `/usr/share/nginx/html`.
- [x] Verificados os logs de inicialização do Nginx: nenhum erro `[error]` ou `[emerg]` foi emitido. Os processos workers iniciaram com sucesso (PID 30 e 31), atestando que a imagem e o container estão corretos.

## Root Cause
O container Nginx é inicializado com sucesso e fica aguardando requisições. O Coolify acusa erro de deploy porque o seu mecanismo de validação (Health Check / Port Probe) não consegue se comunicar com a aplicação na porta/rota configurada. Isso ocorre devido a:
1. **Porta incompatível nas configurações do Coolify:** O Coolify tenta testar a saúde do container em uma porta padrão (como `3000`) enquanto a aplicação está rodando na porta `80`.
2. **Bloqueio de portas pelo Firewall da VM Oracle Cloud:** O firewall nativo da máquina virtual (como `iptables` ou `firewalld`) impede a comunicação de rede externa e interna nas portas de tráfego web.

## Resolution
Para solucionar o erro e concluir o deploy com sucesso, o usuário deve aplicar os seguintes ajustes:

### 1. Corrigir a Porta da Aplicação no Painel do Coolify
1. Vá até as configurações da aplicação no painel do **Coolify**.
2. Procure pelo campo **Port / Application Port** (Porta da Aplicação).
3. Certifique-se de definir esse campo como **`80`** (a mesma porta exposta pelo `Dockerfile` e escutada pelo Nginx).
4. No campo **Health Check Path**, defina apenas **`/`** (raiz) e garanta que o Coolify aceite o status `200` como resposta saudável.

### 2. Liberar as Portas no Firewall da Instância da Oracle Cloud
Conecte-se via SSH na VM da Oracle Cloud e execute os comandos abaixo para liberar a comunicação no sistema operacional:

*   **Se a VM estiver rodando Oracle Linux (Padrão):**
    ```bash
    # Liberar portas de forma permanente no firewalld
    sudo firewall-cmd --permanent --zone=public --add-port=80/tcp
    sudo firewall-cmd --permanent --zone=public --add-port=443/tcp
    sudo firewall-cmd --reload
    ```

*   **Se a VM estiver rodando Ubuntu ou possuir regras rígidas no iptables (Comum na OCI):**
    ```bash
    # Inserir regras de liberação de tráfego no topo do iptables
    sudo iptables -I INPUT 6 -p tcp --dport 80 -j ACCEPT
    sudo iptables -I INPUT 6 -p tcp --dport 443 -j ACCEPT
    # Salvar as novas regras para persistirem após reinicialização
    sudo netfilter-persistent save
    ```

### 3. Liberar o Tráfego na VCN da Oracle Cloud Console (Painel Web da OCI)
Certifique-se de que a rede da Oracle Cloud permite o tráfego de entrada na porta 80 e 443:
1. Acesse o **Console Web da Oracle Cloud**.
2. Vá em **Networking** (Redes) -> **Virtual Cloud Networks** (Redes Virtuais).
3. Selecione a VCN correspondente à sua instância e clique em **Security Lists** (Listas de Segurança) -> **Default Security List**.
4. Adicione uma **Ingress Rule** (Regra de Entrada):
   * **Source Type:** CIDR
   * **Source CIDR:** `0.0.0.0/0` (Qualquer IP)
   * **IP Protocol:** TCP
   * **Destination Port Range:** `80,443`
   * **Description:** "Liberar tráfego HTTP/HTTPS"

**Status**: Em investigação pelo usuário. As correções acima devem restabelecer a comunicação e fazer com que o Coolify valide o deploy com sucesso.
