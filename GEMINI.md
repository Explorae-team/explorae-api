# Exploraê - Monorepo (MVP)

## 🚀 Status Atual

O projeto foi unificado em um **Monorepo** para acelerar a entrega do MVP. O Backend (Spring Boot) está funcional e a estrutura para o Frontend (React) está pronta.

## 📂 Estrutura do Projeto

- `/backend`: API REST (Spring Boot, Java 25, PostgreSQL, JWT).
- `/frontend`: Aplicação Web (React/TypeScript - Em breve).
- `/docs`: Documentação de modelagem e requisitos.

## ✅ O que já foi feito (Atualizado em 26/03/2026)

### Backend

- [X] **Setup Inicial**: Spring Boot 4.0.3 configurado com Java 25.
- [X] **Banco de Dados**: Liquibase configurado com UUIDs.
- [X] **Segurança**: JWT funcional com login e registro de usuários.
- [X] **CORS**: Configurado para integração com o frontend.
- [x] **Preferências de Viagem**: Entidade `TravelPreference` e relacionamento com Usuário implementados (SDGEU-23).
- [x] **Gamificação**: Modelagem de XP, Nível, Medalhas e Histórico concluída (SDGEU-82).

### Infraestrutura/Organização

- [X] **Monorepo Setup**: Unificação dos repositórios para facilitar a sincronia de features.

## 📌 Próximos Passos (Backlog Imediato)

1. **SDGEU-83**: Criar serviço de XP e level up no backend.
2. **SDGEU-19-FE**: Iniciar o setup do React na pasta `/frontend`.
3. **Docker**: Criar `docker-compose.yml` para subir o ambiente completo.
4. **Testes**: Corrigir conflitos de dependências nos testes do backend.

## 🛠 Decisões Técnicas (Monorepo)

- **Sincronia**: Mudanças que afetam Back e Front devem ser feitas no mesmo PR.
- **Padrões**: Manter o `StandardResponseDTO` para comunicação consistente.
- **Commits**: Todas as mensagens de commit devem ser escritas em **Português**, seguindo o padrão de prefixos (feat, fix, chore, etc).

## 📝 Padrão de Comentários (Humano & Direto)

Mantemos o foco em comentários que explicam o "porquê" de forma objetiva e direta.

## 🗺️ Plano de Migração: React Web para React Native (Expo)

Para alinhar o projeto com a visão de longo prazo do Exploraê, o frontend será convertido de React (Vite) para **React Native com Expo**. Isso permitirá gerar um **PWA** para o MVP e Apps Nativos (Android/iOS) posteriormente sem reescrita.

### 1. Preparação do Ambiente

- [ ] Inicializar o Expo no diretório `/frontend` (mantendo o histórico do Git).
- [ ] Instalar dependências base: `expo`, `react-native`, `expo-router`, `react-native-safe-area-context`, `react-native-screens`.

### 2. Conversão de Componentes (Mapeamento)

O integrante deve substituir as tags HTML por componentes nativos:

- `<div>` -> `<View>`
- `<span>`, `<h1>`, `<p>` -> `<Text>`
- `<img>` -> `<Image>`
- `<button>`, `<a>` -> `<TouchableOpacity>` ou `<Pressable>`
- `<input>` -> `<TextInput>`

### 3. Ajuste de Estilização

- [ ] Migrar o `global.css` para `StyleSheet.create` ou bibliotecas como `NativeWind` (Tailwind para RN).
- [ ] **Importante:** Flexbox no React Native tem `flexDirection: column` por padrão (diferente da Web).

### 4. Roteamento e Autenticação

- [ ] Substituir `react-router-dom` pelo **Expo Router** (baseado em arquivos).
- [ ] Adaptar o `AuthContext.jsx` para usar `expo-secure-store` em vez de `localStorage` para maior segurança.

### 5. Configuração PWA (MVP)

- [ ] Configurar o `app.json` com as propriedades `web` e `pwa`.
- [ ] Gerar ícones e splash screen usando o `npx expo prebuild`.

## 📈 Oportunidades de Otimização (Pós-MVP)
- **Performance de Autenticação:** Atualmente, o `JwtAuthenticationFilter` realiza uma consulta ao banco (`loadUserByUsername`) em **cada requisição**. Para escalar, podemos migrar para um modelo onde o filtro valida as permissões (Claims) diretamente do Token JWT, reduzindo a carga no banco de dados.

---

*Última atualização: 26 de março de 2026*
