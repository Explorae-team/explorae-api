# Exploraê - Monorepo (MVP) 🗺️✨

O **Exploraê** é um guia turístico inteligente e gamificado que oferece roteiros e recomendações de atrações totalmente personalizadas com base no perfil de interesses do usuário. O projeto é estruturado em um **Monorepo** para máxima agilidade e consistência de desenvolvimento entre o ecossistema móvel e a API REST.

---

## 📂 Estrutura de Pastas

* `/backend`: API REST de alto desempenho (Spring Boot 4.0.3, Java 25, PostgreSQL, JWT).
* `/frontend`: Aplicação Mobile / PWA (Expo, React Native, TypeScript, NativeWind/Tailwind).
* `/docs`: Modelagem de dados, diagramas de requisitos e decisões de arquitetura.
* `/terraform`: Infraestrutura como Código (IaC) para provisionamento na Oracle Cloud Infrastructure (OCI).

---

## 🛠 Stack Tecnológica

### Backend (API REST)
* **Java 25** & **Spring Boot 4.0.3**
* **Spring Security** & **JWT (JSON Web Tokens)** para autenticação robusta.
* **PostgreSQL** com migrações gerenciadas via **Liquibase** (utilizando UUIDs consistentes).
* **Supabase Client** integrado para armazenamento e entrega de imagens de atrações em nuvem.

### Frontend (Mobile & Web)
* **Expo (React Native)** com **Expo Router** (navegação baseada em arquivos).
* **TypeScript** para tipagem estática e segurança do código.
* **NativeWind** para estilização utilitária elegante.
* **Axios** com interceptores configurados para gerenciamento de JWT e renovação de sessões.
* **Jest** & **React Native Testing Library** para testes unitários de alta cobertura.

---

## 🚀 Como Rodar o Projeto

### 🔌 Banco de Dados (PostgreSQL)

O arquivo `docker-compose.yml` na raiz é configurado para deploy via Coolify. Para desenvolvimento local, você tem duas opções:

#### Opção A: Sem Docker (Usando banco em memória H2)
A forma mais rápida de rodar o backend. Utiliza o banco de dados H2 em memória, criando e populando as tabelas automaticamente via Liquibase:
1. Navegue até a pasta do backend:
   ```bash
   cd backend
   ```
2. Inicie o Spring Boot com o profile `local`:
   ```bash
   # No Windows (PowerShell):
   .\mvnw spring-boot:run -Dspring-boot.run.profiles=local
   
   # No Linux/WSL:
   ./mvnw spring-boot:run -Dspring-boot.run.profiles=local
   ```

#### Opção B: Usando Docker CLI (PostgreSQL real)
Se você prefere testar com o banco PostgreSQL completo via Docker:
1. Suba o container oficial do Postgres:
   ```bash
   docker run --name explorae-postgres -p 5432:5432 -e POSTGRES_DB=explorae_db -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -d postgres:15
   ```
   *(Nota: Se o Docker CLI do seu WSL estiver configurado para escutar via TCP, lembre-se de configurar a variável `export DOCKER_HOST=tcp://127.0.0.1:2375` antes).*
2. Com o banco ativo, configure o arquivo `backend/.env` com as credenciais.
3. Inicie o servidor normalmente:
   ```bash
   cd backend
   .\mvnw spring-boot:run
   ```

### 📱 Rodando o Frontend (Expo)
1. Navegue até a pasta do frontend:
   ```bash
   cd frontend
   ```
2. Certifique-se de ter as dependências instaladas:
   ```bash
   npm install
   ```
3. Inicialize o servidor de desenvolvimento do Expo:
   ```bash
   npm run start
   ```
   * Utilize `npm run web` para abrir no navegador, ou escaneie o QR Code com o app **Expo Go** no seu smartphone físico.

---

## 🧪 Rodando os Testes Automatizados

### Backend
Para rodar a suíte completa de testes unitários e de integração do Spring Boot:
```bash
cd backend
./mvnw test
```

### Frontend (Jest)
Para rodar os testes unitários de componentes e hooks do React Native/Expo:
```bash
cd frontend
npm run test
```

---

## 🤝 Diretrizes de Desenvolvimento (Padrões do MVP)

1. **Sincronia Back/Front**: Alterações que afetem contratos de endpoints devem ser desenvolvidas, testadas e enviadas no **mesmo Pull Request** para evitar inconsistências no ambiente de integração.
2. **Padrão de Resposta**: Toda a comunicação da API utiliza a classe `StandardResponseDTO` como envelope padronizado.
3. **Commits**: Todas as mensagens de commits devem ser escritas em **Português**, seguindo a especificação do *Conventional Commits* (ex: `feat(FE-10): ...`, `fix(BE-02): ...`, `docs(10): ...`).
