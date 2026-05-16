# Documentação de Casos de Uso - Exploraê

Este documento detalha os Casos de Uso do sistema Exploraê, estruturado para análise de sistemas com foco em gamificação e roteirização turística.



## Módulo de Perfil & Onboarding


### UC01: Manter Cadastro de Usuário <<CRUD>>

| Campo | Detalhe |
|---|---|
| **ID** | UC01 |
| **Atores** | Explorador, Administrador |
| **Interessados** | Usuário (acesso ao app), Sistema (segurança) |
| **Pré-condição** | E-mail válido e único |
| **Pós-condição** | Conta criada no Supabase Auth e perfil no banco PostgreSQL |
| **Backlog ID** | SDGEU-147 <br> SDGEU-151 |
| **Tecnologia** | Supabase Auth, Spring Security, JWT |
| **Fluxo Básico** | 1. Usuário informa e-mail e senha.<br>2. Sistema valida critérios de senha forte.<br>3. Sistema cria usuário no Auth provider.<br>4. Sistema inicializa perfil com Nível 1 e 0 XP. |
| **Fluxo Variante** | **Social Login**: Cadastro via Google/Apple. |
| **Fluxo Exceção** | **E-mail Duplicado**: Sistema informa que o usuário já existe. |

---

### UC02: Autenticar Usuário

| Campo | Detalhe |
|---|---|
| **ID** | UC02 |
| **Atores** | Explorador, Parceiro, Administrador |
| **Interessados** | Usuário (acesso), Sistema (controle de acesso) |
| **Pré-condição** | Usuário cadastrado (UC01) |
| **Pós-condição** | Token JWT gerado e sessão ativa no dispositivo |
| **Backlog ID** | SDGEU-145 <br> SDGEU-146  |
| **Tecnologia** | Supabase Auth, JWT, Axios Interceptors |
| **Fluxo Básico** | 1. Usuário informa credenciais.<br>2. Sistema valida contra o Supabase Auth.<br>3. Sistema retorna dados do perfil e Token.<br>4. Sistema redireciona para a Dashboard ou Wizard (se novo usuário). |
| **Fluxo Variante** | **Lembrar Senha**: Sistema gera link de recuperação via e-mail. |
| **Fluxo Exceção** | **Credenciais Inválidas**: Sistema exibe erro e solicita nova tentativa. |

---

### UC03: Configurar Preferências de Viagem (Wizard)

| Campo | Detalhe |
|---|---|
| **ID** | UC03 |
| **Atores** | Explorador |
| **Interessados** | Explorador (feed personalizado), Sistema (recomendações) |
| **Pré-condição** | Usuário autenticado (UC02) |
| **Pós-condição** | Preferências salvas e feed de atrações atualizado |
| **Backlog ID** | SDGEU-152 |
| **Tecnologia** | React Native (Expo), Spring Boot, Supabase (PostgreSQL) |
| **Fluxo Básico** | 1. Usuário acessa tela de preferências.<br>2. Sistema apresenta Wizard de 5 passos (Gastronomia, Cultura, Aventura, Relaxamento, Noite).<br>3. Usuário seleciona categorias em cada passo.<br>4. Usuário finaliza o Wizard.<br>5. Sistema salva slugs e redireciona para o Feed. |
| **Fluxo Variante** | **Editar Preferências**: Usuário acessa pelo perfil e altera categorias já salvas. |
| **Fluxo Exceção** | **Erro de Conexão**: Sistema exibe alerta e permite tentar salvar novamente. |

---

## Módulo de Exploração & Rotas


### UC04: Explorar Feed de Atrações

| Campo | Detalhe |
|---|---|
| **ID** | UC04 |
| **Atores** | Explorador |
| **Interessados** | Explorador (descoberta), Parceiro (visibilidade) |
| **Pré-condição** | Preferências configuradas (UC03) |
| **Pós-condição** | Lista de atrações filtrada e ordenada |
| **Backlog ID** | SDGEU-154 <br> SDGEU-155 <br> SDGEU-156 <br> SDGEU-157 |
| **Tecnologia** | Spring Boot (Pagination), React Native (FlatList) |
| **Fluxo Básico** | 1. Usuário acessa aba Explore.<br>2. Sistema identifica interesses do usuário.<br>3. Sistema busca atrações no banco que dêem "match" com as categorias.<br>4. Sistema apresenta Cards com foto, preço, nota e selo de parceiro. |
| **Fluxo Variante** | **Refresh Manual**: Usuário "puxa para baixo" para atualizar a lista. |
| **Fluxo Exceção** | **Sem Resultados**: Sistema sugere que o usuário altere suas preferências no perfil. |

---

### UC09: Visualizar Mapa Interativo

| Campo | Detalhe |
|---|---|
| **ID** | UC09 |
| **Atores** | Explorador |
| **Interessados** | Explorador (localização visual) |
| **Pré-condição** | Permissão de localização concedida (UC11) |
| **Pós-condição** | Mapa exibido com pins coloridos por categoria |
| **Backlog ID** | SDGEU-157 <br> SDGEU-158 |
| **Tecnologia** | React Native Maps (Google/Apple SDKs) |
| **Fluxo Básico** | 1. Usuário alterna para visão de Mapa.<br>2. Sistema obtém coordenadas das atrações do banco.<br>3. Sistema renderiza pins coloridos por categoria.<br>4. Usuário clica no pin.<br>5. Sistema abre 'Bottom Sheet' com resumo e foto da atração. |
| **Fluxo Variante** | **Filtro de Categoria**: Usuário filtra o mapa para mostrar apenas "Gastronomia". |
| **Fluxo Exceção** | **GPS Desativado**: Sistema exibe posição padrão e solicita ativação do GPS. |

---

### UC10: Planejar Rota Otimizada

| Campo | Detalhe |
|---|---|
| **ID** | UC10 |
| **Atores** | Explorador |
| **Interessados** | Explorador (eficiência no deslocamento) |
| **Pré-condição** | Geolocalização ativa (UC11), Atrações selecionadas |
| **Pós-condição** | Rota exibida no mapa com estimativas de tempo e distância |
| **Backlog ID** | SDGEU-159 |
| **Tecnologia** | Google Maps API / Mapbox, React Native Maps, Node.js/Spring Boot |
| **Fluxo Básico** | 1. Usuário seleciona até 10 pontos de interesse.<br>2. Usuário escolhe modo de transporte (Pé, Público, Uber/99).<br>3. Sistema calcula a melhor ordem dos pontos.<br>4. Sistema exibe a linha da rota no mapa.<br>5. Sistema mostra tempo e distância total. |
| **Fluxo Variante** | **Alterar Ordem Manual**: Usuário arrasta pontos para mudar a sequência. |
| **Fluxo Exceção** | **Limite Excedido**: Usuário tenta adicionar 11º ponto; Sistema bloqueia e avisa o limite. |

---

### UC11: Gerenciar Geolocalização

| Campo | Detalhe |
|---|---|
| **ID** | UC11 |
| **Atores** | Explorador |
| **Interessados** | Sistema (precisão de navegação) |
| **Pré-condição** | Hardware de GPS ativo |
| **Pós-condição** | Coordenadas [Lat, Lng] disponíveis em tempo real |
| **Backlog ID** | SDGEU-160 |
| **Tecnologia** | Expo Location, Google Directions API |
| **Fluxo Básico** | 1. App solicita permissão de GPS no primeiro acesso.<br>2. Usuário aceita.<br>3. Sistema captura posição a cada 5 segundos.<br>4. Sistema atualiza marcador de posição no mapa. |
| **Fluxo Variante** | **Economia de Bateria**: Sistema reduz frequência de captura se o app estiver em background. |
| **Fluxo Exceção** | **Permissão Negada**: Sistema exibe alerta instruindo como ativar nas configurações do SO. |

---

## Módulo de Gamificação


### UC05: Avaliar Atração (Gamificação)

| Campo | Detalhe |
|---|---|
| **ID** | UC05 |
| **Atores** | Explorador |
| **Interessados** | Explorador (ganha XP), Parceiro (feedback), Outros Usuários (recomendações) |
| **Pré-condição** | Usuário ter visitado a atração (baseado em geofencing ou check-in) |
| **Pós-condição** | XP adicionado ao perfil e comentário visível no feed |
| **Backlog ID** | SDGEU-161 <br> SDGEU-162 |
| **Tecnologia** | Spring Boot (Gamification Service), PostgreSQL (Histórico de XP) |
| **Fluxo Básico** | 1. Usuário seleciona "Avaliar" na tela da atração.<br>2. Usuário atribui nota e escreve comentário.<br>3. Sistema valida a submissão.<br>4. Sistema calcula XP baseado no nível do usuário.<br>5. Sistema exibe mensagem de "Level Up" se atingir a meta. |
| **Fluxo Variante** | **Edição de Avaliação**: Usuário altera sua nota; sistema recalcula média mas não dá XP novo. |
| **Fluxo Exceção** | **Tentativa de Spam**: Sistema bloqueia avaliações repetidas em curto intervalo. |

---

### UC06: Visualizar Perfil e Gamificação

| Campo | Detalhe |
|---|---|
| **ID** | UC06 |
| **Atores** | Explorador |
| **Interessados** | Explorador (acompanhar progresso) |
| **Pré-condição** | Usuário autenticado |
| **Pós-condição** | Exibição de estatísticas e medalhas atualizadas |
| **Backlog ID** | SDGEU-151 <br> SDGEU-161 <br> SDGEU-163 |
| **Tecnologia** | React Native, NativeWind, API de Gamificação |
| **Fluxo Básico** | 1. Usuário acessa aba Perfil.<br>2. Sistema exibe Foto, Nível, Barra de XP e Total de Pontos.<br>3. Sistema lista Medalhas (Badges) conquistadas.<br>4. Sistema mostra histórico recente de atividades. |
| **Fluxo Variante** | **Compartilhar Perfil**: Usuário gera imagem/link com suas conquistas para redes sociais. |
| **Fluxo Exceção** | **Dados Inconsistentes**: Sistema exibe placeholder e tenta recarregar dados do servidor. |

---

## Módulo de Administração & Parceiro


### UC07: Manter Atração <<CRUD>>

| Campo | Detalhe |
|---|---|
| **ID** | UC07 |
| **Atores** | Parceiro, Administrador |
| **Interessados** | Parceiro (gestão de negócio), Explorador (acesso a informações) |
| **Pré-condição** | Usuário com role 'PARTNER' ou 'ADMIN' |
| **Pós-condição** | Atração criada, editada ou removida do catálogo |
| **Backlog ID** | Indisponível |
| **Tecnologia** | Spring Data JPA, Supabase Storage (Imagens) |
| **Fluxo Básico** | 1. Ator seleciona "Gerenciar Atrações".<br>2. Sistema abre formulário (Nome, Descrição, Coordenadas, Preço, Categoria).<br>3. Ator faz upload de fotos.<br>4. Sistema salva no banco e invalida cache de busca. |
| **Fluxo Variante** | **Desativar Temporariamente**: Ator oculta a atração sem deletar. |
| **Fluxo Exceção** | **Falha no Upload**: Sistema mantém dados do formulário e solicita nova tentativa de imagem. |

---

### UC08: Gerenciar Sistema (Dashboard Admin)

| Campo | Detalhe |
|---|---|
| **ID** | UC08 |
| **Atores** | Administrador |
| **Interessados** | Sistema (saúde e moderação) |
| **Pré-condição** | Login com credenciais administrativas |
| **Pós-condição** | Configurações do sistema aplicadas |
| **Backlog ID** | Indisponível |
| **Tecnologia** | Spring Boot Actuator, Dashboard Custom |
| **Fluxo Básico** | 1. Admin acessa portal de gestão.<br>2. Sistema exibe métricas (Total usuários, Atividades hoje).<br>3. Admin aprova novos parceiros cadastrados.<br>4. Admin modera comentários/avaliações denunciadas. |
| **Fluxo Variante** | **Gerar Relatórios <<rep>>**: Sistema exporta CSV com dados de engajamento. |
| **Fluxo Exceção** | **Acesso Não Autorizado**: Sistema bloqueia e registra tentativa de invasão (logs). |

---
