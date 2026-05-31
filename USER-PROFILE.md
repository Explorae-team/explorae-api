# 👤 Perfil do Desenvolvedor (User Profile)

Este documento foi gerado automaticamente através da análise comportamental e técnica de sessões de trabalho anteriores no projeto **Exploraê**. Ele define as preferências, o estilo de codificação, as prioridades de qualidade e o tom de comunicação ideais para calibrar as interações com o assistente IA.

---

## 📊 Dimensões do Perfil

| Dimensão | Classificação | Descrição / Preferência |
| :--- | :--- | :--- |
| **Idioma de Preferência** | `PT-BR` | Comunicação estritamente em Português do Brasil. |
| **Estilo de Comunicação** | `Assertivo / Direto` | Sem rodeios, polidez excessiva ou explicações teóricas repetitivas. Foco nos resultados obtidos, diagnósticos e planos práticos. |
| **Nível Técnico** | `Avançado (Fullstack & DevOps)` | Domínio aprofundado de arquitetura multicamadas, padrões de banco de dados relacional, orquestração de containers, deploy e troubleshooting de sistema operacional (Windows/PowerShell). |
| **Rigores de Qualidade** | `Alto (Orientado a Testes/Gates)` | Prefere ambientes de testes extremamente isolados, mocks precisos de rede (Axios) e banco de dados H2 de teste totalmente limpo. |

---

## 🛠️ Padrões de Tecnologia e Codificação Preferidos

### ☕ 1. Backend (Java & Spring Boot)
- **Java 25 Moderno:** Uso explícito de recursos novos como Pattern Matching, Records para DTOs, Virtual Threads, `var` para variáveis locais e expressões funcionais (Streams/Lambdas) quando aplicável.
- **Evitar Verbose/Boilerplate:** Uso intensivo do Lombok (`@Data`, `@Builder`, `@RequiredArgsConstructor`) e MapStruct para mappers eficientes em tempo de compilação.
- **Segurança e Validação:** Rigor em endpoints seguros via tokens JWT stateless e validações rígidas de payloads recebidos nos Controllers (`@Valid`, `@NotNull`, `@Size`).
- **Banco de Dados Evolutivo:** Controle total via migrações do Liquibase (esquemas indexados sequencialmente em XML).

### 📱 2. Frontend (React Native & Expo)
- **TypeScript Estrito:** Tipagem explícita em todos os componentes, services e hooks, evitando o uso de `any`.
- **CSS Utilitário:** Estilização baseada em TailwindCSS compilado nativamente via **NativeWind v4** (interfaces limpas, responsivas e fluidas no Mobile e Web PWA).
- **Roteamento Moderno:** Utilização de navegação baseada em arquivos via Expo Router, aplicando guards de segurança e onboarding com redirecionamento imperativo e resiliente.
- **Rede e Armazenamento:** Axios estruturado com interceptores automatizados de segurança, e cache seguro com SecureStore e AsyncStorage.

---

## ☁️ Filosofia de Infraestrutura (DevOps)
- **Containerização Total:** Builds multi-stage para gerar imagens leves e rápidas no Docker.
- **Orquestração Visual:** Uso do **Coolify** hospedado na **Oracle Cloud (OCI)** Always Free para deploys automáticos baseados no Git.
- **Bancos Gerenciados:** Utilização do **Supabase** como base de dados relacional em nuvem, garantindo isolamento da infraestrutura de aplicação.

---

## 📝 Diretrizes de Interação com a IA
1. **Vá Direto ao Ponto:** Em diagnósticos de erros ou relatórios de progresso, mostre o arquivo, a linha correspondente e o código sugerido em formato diff sem textões teóricos longos.
2. **Respeite o Ambiente:** Ao executar comandos ou propor scripts no Windows, considere restrições locais de permissão do PowerShell (use Bypass e cmd-wrappers quando necessário).
3. **Mantenha os Comentários Focados:** Escreva comentários apenas para explicar decisões de arquitetura e "porquês" de negócios no código-fonte, sem redundâncias textuais.
