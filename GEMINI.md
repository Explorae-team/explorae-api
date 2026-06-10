# Exploraê - Monorepo (MVP)

## 🚀 Status Atual

O projeto foi unificado em um **Monorepo**. O Backend (Spring Boot) está totalmente funcional, conectado ao banco de dados PostgreSQL do Supabase (produção) ou H2 (desenvolvimento local) com regras de gamificação e catálogo. O Frontend em **Expo (React Native)** agora conta com recursos avançados de geolocalização multiplataforma, mapa interativo com cálculo de rotas dinâmico, barra de busca inteligente e padronização visual premium.

## 📂 Estrutura do Projeto

- `/backend`: API REST (Spring Boot, Java 25, PostgreSQL, JWT).
- `/frontend`: Aplicação Mobile/PWA (Expo/TypeScript).
- `/docs`: Documentação de modelagem, diagramas de requisitos e arquivos zip de modelagem de dados.

## ✅ O que já foi feito (Concluído em 08/06/2026)

### Backend
- [X] **Setup Inicial**: Spring Boot 4.0.3 configurado com Java 25.
- [X] **Banco de Dados**: Liquibase configurado com UUIDs.
- [X] **Segurança**: JWT funcional com login e registro de usuários.
- [X] **CORS**: Configurado dinamicamente para aceitar conexões locais (`*`) e restrito em produção (`https://explorae.site`).
- [X] **Preferências de Viagem**: Entidade `TravelPreference` e relacionamento com Usuário (SDGEU-23).
- [X] **Serviço de Preferências**: Recuperação e atualização de interesses via API (SDGEU-191).
- [X] **Gamificação**: Modelagem de XP, Nível, Medalhas (Badge) e Histórico concluída (SDGEU-82).
- [X] **XP & Level Up**: Serviço de XP e progressão de nível implementado (SDGEU-83).
- [X] **Modelo de Atração**: Entidade `Attraction` e Repositório configurados (SDGEU-209).
- [X] **Seeds de Dados**: Banco populado com 20 atrações iniciais via Liquibase (SDGEU-211).
- [X] **API de Listagem**: Criar endpoint paginado para o Feed (Phase 4).
- [X] **Listagem Sem Paginação**: Adicionado parâmetro `fetchAll` em `GET /api/v1/attractions` para retornar todas as atrações sem paginação, viabilizando buscas e plotagem completa no mapa.
- [X] **Infraestrutura de Testes (Backend)**: Setup de H2 e application-test.properties para testes isolados (Phase 14-BE).
- [X] **Gerenciamento de Segredos**: Integração robusta com variáveis do Supabase e controle de chaves liberado para gerenciamento direto no Coolify.

### Frontend (Mobile - Expo)
- [X] **Setup Expo**: Inicialização com Expo Router e TypeScript (SDGEU-19-FE).
- [X] **Auth Flow**: Login e Registro integrados com o backend.
- [X] **Onboarding**: Tela de Preferências com seleção de interesses e redirecionamento forçado (SDGEU-22-FE).
- [X] **Perfil do Explorador**: Interface integrada com dados reais, XP, Nível, Medalhas e Histórico (SDGEU-203).
- [X] **Configurações & Preferências**: Central de configurações, logout e re-onboarding de interesses (SDGEU-205).
- [X] **Componentes UI**: Componente `AttractionCard` (Variant: Default) implementado e testado (SDGEU-213).
- [X] **Dashboard Explore**: Tela principal integrada com o backend, carregando atrações reais com paginação, preço e selo de parceiro (SDGEU-154).
- [X] **Carrossel de Recomendações & Feed Paginado**: Dashboard integrado com geolocalização multiplataforma, carrossel horizontal de afinidades e feed vertical dinâmico (SDGEU-377 / Phase 10).
- [X] **Mapa Interativo & Roteamento (Sprint 03)**: Exibição de atrações em tempo real no mapa com base em coordenadas GPS, suporte a traçado de rotas em tempo real via `Polyline` conectada à API OSRM (direções para carro, caminhada e ônibus) e enquadramento dinâmico da câmera.
- [X] **Fila e Roteiro Inteligente**: Ordenação automática dos pontos turísticos utilizando o algoritmo *Nearest Neighbor* (Vizinho Mais Próximo) a partir do destino inicial selecionado.
- [X] **Busca de Atrações no Mapa**: Input de busca inteligente com *debounce* de 400ms integrado ao mapa, permitindo autocompletar destinos e traçar rotas direto do resultado da busca.
- [X] **Componente `ExploraScrollView`**: Componente de rolagem unificado e customizado que adiciona suporte nativo e consistente a Pull-to-Refresh em todas as telas de dashboard, detalhes de atrações, perfil, cupons e favoritos.
- [X] **Polimento Visual Premium**: Telas de redefinição/recuperação de senha redesenhadas para Dark Mode, padronização de ícones de navegação com a cor do sistema (`colors.primary`) e carregamento em tempo real do avatar do usuário após o upload.
- [X] **Infraestrutura de Testes (Frontend)**: Estabilização de mocks do Axios e Jest para ambiente Expo (Phase 14-FE).

## 📌 Próximos Passos (Sprint 04)

1. **Check-In por Proximidade**: Validar chegada física do usuário ao ponto turístico usando o GPS e conceder recompensas em XP e moedas.
2. **Sistema de Vouchers/Recompensas**: Fluxo completo de geração e resgate de cupons de descontos com parceiros locais.

## 🛠 Decisões Técnicas (Monorepo)
- **Sincronia**: Mudanças que afetam Back e Front devem ser feitas no mesmo PR.
- **Padrões**: Manter o `StandardResponseDTO` para comunicação consistente.
- **Commits**: Todas as mensagens de commit devem ser escritas em **Português**, seguindo o padrão de prefixos (feat, fix, chore, etc).
- **Gamificação**: Fórmula de nível baseada em `nível * 100` XP para o próximo nível.
- **Onboarding**: Usuários sem preferências são obrigatoriamente redirecionados para `/preferences`.
- **CORS Local**: Definido como `*` em ambiente de desenvolvimento local para evitar que trocas de redes Wi-Fi ou simuladores mobile tenham conexões negadas pelo backend.
- **Scroll e Refresh**: Uso exclusivo do `ExploraScrollView` em telas que necessitem de atualização de dados, garantindo a uniformidade de transição da interface.

## 📝 Padrão de Comentários (Humano & Direto)
Mantemos o foco em comentários que explicam o "porquê" de forma objetiva e direta.

## 📈 Oportunidades de Otimização (Pós-MVP)
- **Performance de Autenticação:** Migrar para validação de Claims no Token JWT para reduzir consultas ao banco.

---

*Última atualização: 08 de junho de 2026 - Conclusão do Mapa Interativo, Roteamento OSRM, Busca no Mapa e Padronização de Componentes.*
