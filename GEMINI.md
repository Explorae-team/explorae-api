# Exploraê - Monorepo (MVP)

## 🚀 Status Atual
O projeto foi unificado em um **Monorepo** para acelerar a entrega do MVP. O Backend (Spring Boot) está funcional e a estrutura para o Frontend (React) está pronta.

## 📂 Estrutura do Projeto
- `/backend`: API REST (Spring Boot, Java 21, PostgreSQL, JWT).
- `/frontend`: Aplicação Web (React/TypeScript - Em breve).
- `/docs`: Documentação de modelagem e requisitos.

## ✅ O que já foi feito (Atualizado em 25/03/2026)
### Backend
- [x] **Setup Inicial**: Spring Boot 4.0.3 configurado com Java 21.
- [x] **Banco de Dados**: Liquibase configurado com UUIDs.
- [x] **Segurança**: JWT funcional com login e registro de usuários.
- [x] **CORS**: Configurado para integração com o frontend.

### Infraestrutura/Organização
- [x] **Monorepo Setup**: Unificação dos repositórios para facilitar a sincronia de features.

## 📌 Próximos Passos (Backlog Imediato)
1. **SDGEU-19-FE**: Iniciar o setup do React na pasta `/frontend`.
2. **Docker**: Criar `docker-compose.yml` para subir o ambiente completo.
3. **Testes**: Corrigir conflitos de dependências nos testes do backend.

## 🛠 Decisões Técnicas (Monorepo)
- **Sincronia**: Mudanças que afetam Back e Front devem ser feitas no mesmo PR.
- **Padrões**: Manter o `StandardResponseDTO` para comunicação consistente.
- **Commits**: Todas as mensagens de commit devem ser escritas em **Português**, seguindo o padrão de prefixos (feat, fix, chore, etc).

## 📝 Padrão de Comentários (Humano & Direto)
Mantemos o foco em comentários que explicam o "porquê" de forma objetiva e direta.

---
*Última atualização: 25 de março de 2026*
