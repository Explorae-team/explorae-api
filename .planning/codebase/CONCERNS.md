# Pontos de Atenção, Riscos e Dívidas Técnicas (CONCERNS.md)

Este documento elenca as preocupações arquiteturais, potenciais riscos de implementação e itens identificados para melhoria pós-MVP na base de código do **Exploraê**.

---

## 🎯 1. Riscos de Desenvolvimento Ativos (Sprint 04 - Mapa Interativo)

Como a principal tarefa da Sprint 04 é a implementação do **Mapa Interativo** das atrações em tempo real, as seguintes preocupações técnicas devem ser mitigadas:

*   **Compatibilidade do React Native Maps na Web (RESOLVIDO):**
    *   *Contexto:* A biblioteca `react-native-maps` possui excelente suporte nativo para iOS e Android, mas é incompatível e instável na Web.
    *   *Resolução:* Implementamos um fallback de geolocalização com renderização via Iframe interativo do Google Maps. Para otimizar a usabilidade na web e mitigar telas brancas durante reordenações, removemos a recriação de componentes reatribuindo chaves e implementamos um cache global de URLs (`iframeUrlCache`) na página de rotas.
*   **Segurança e Restrição de Chaves do Google Maps:**
    *   *Contexto:* Para que a renderização ocorra no cliente, a chave `GOOGLE_MAPS_API_KEY` deve estar embutida no frontend. Chaves de API expostas em aplicativos nativos ou PWAs correm o risco de serem extraídas por engenharia reversa.
    *   *Mitigação:* É altamente recomendável instruir o proprietário do console do Google Cloud a **restringir o uso da chave**, limitando as requisições especificamente ao bundle ID do app Android (`com.herbertcarvalho021.exploraenew`), aos certificados digitais (SHA-1 fingerprint) correspondentes e, na Web, aos domínios autorizados.

---

## 🏗️ 2. Dívidas Técnicas & Oportunidades de Otimização

*   **Performance de Autenticação (Consulta Recorrente ao Banco de Dados):**
    *   *Contexto:* O middleware de segurança do Spring Boot intercepta e valida os tokens JWT, mas a cada requisição sensível, o backend consulta o banco de dados para verificar as preferências de viagem (`TravelPreference`) e detalhes do perfil do usuário para anexar ao contexto de resposta.
    *   *Otimização:* Migrar o fluxo de autenticação para validar diretamente as Claims internas do token JWT (armazenando interesses básicos codificados ou claims de controle no payload assinado do JWT), aliviando de forma drástica a carga de requisições ao PostgreSQL.
*   **Prevenção de Falsos-Positivos no Rate Limiting (HTTP 429):**
    *   *Contexto:* O rate limiting usando `Bucket4j` está ativo. Porém, com a introdução de atualizações dinâmicas de geolocalização no mapa ou feeds com rolagem contínua acelerada, requisições repetidas do frontend podem acionar de forma acidental os filtros de segurança, bloqueando usuários legítimos.
    *   *Mitigação:* Realizar o tuning fino das regras de Bucket do `RateLimitFilter` para tolerar rajadas de requisições específicas de leitura e consulta ao mapa, separando-as das restrições rígidas aplicadas às rotas de login/registro.

---

## 🗺️ 3. Robustez Operacional

*   **Integridade da Geolocalização:**
    *   *Contexto:* O aplicativo coleta dados do GPS utilizando `expo-location`. Caso o usuário negue permissões, o fluxo de fallback para as coordenadas de João Pessoa mantém a interface estável, mas limita a interatividade do mapa.
    *   *Melhoria:* O fluxo deve fornecer feedbacks claros e amigáveis ao usuário, explicando a importância das permissões de geolocalização e indicando com facilidade como reativá-las nas configurações do sistema operacional nativo.
