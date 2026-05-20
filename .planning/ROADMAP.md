# Roadmap - Sprint 03

## Wave 1: Base de Dados e Componentes (Fundação)
- [X] **Phase 1**: [SDGEU-209] Modelar Entidade Attraction e Repositório (Backend)
- [X] **Phase 2**: [SDGEU-211] Popular Banco com Seeds de Atrações Iniciais (Liquibase)
- [X] **Phase 3**: [SDGEU-213] Desenvolver Componente Card de Atração (Expo/Native)

## Wave 2: Entrega do Feed Principal
- [X] **Phase 4**: [SDGEU-215] Criar API de Listagem de Atrações com Paginação
- [X] **Phase 5**: [SDGEU-219] Implementar Feed de Atrações com Dashboard (SDGEU-154 concluída)

## Wave 3: Interface de Busca e Ordenação
- [X] **Phase 6**: [SDGEU-221] Criar Interface de Filtros e Categorias (Expo/Native)
- [X] **Phase 7**: [SDGEU-376] Integrar Filtros com o Estado Global do Feed (Expo/Native)
- [X] **Phase 8**: [SDGEU-225] Criar Endpoint de Detalhes da Atração (Spring Boot)

## Wave 4: Recomendações e Algoritmos
- [X] **Phase 9**: [SDGEU-223] Criar Algoritmo de Recomendação Baseado em Preferências (Backend)
- [ ] **Phase 10**: [SDGEU-377] Exibir Carrossel de Recomendações no Feed (Expo/Native)

## Wave 5: Detalhes e Experiência do Usuário (Polish)
- [X] **Phase 11**: [SDGEU-227] Implementar Tela de Detalhes da Atração (Expo/Native)
- [X] **Phase 12**: [SDGEU-378] Implementar Galeria de Fotos e Carousel (Expo/Native)
- [X] **Phase 13**: [SDGEU-379] Testes Unitários e de Integração (Feed)

## Wave 6: Infraestrutura e Deploy
- [X] **Phase 14**: Configurar e Validar Infraestrutura com Terraform (OCI)
- [X] **Phase 15**: Migrar Banco de Dados para Supabase (PostgreSQL)
- [X] **Phase 16**: Implement Supabase Storage para Imagens de Atrações
- [X] **Phase 17**: Implementar Tela de Recuperação de Senha (Expo/Native)

---

## Estrutura de User Stories (Parent Tracking)

### [SDGEU-154] Feed de Atrações
- Phases: 1, 2, 3, 4, 5, 13

### [SDGEU-155] Filtros de Atrações
- Phases: 6, 7

### [SDGEU-156] Recomendações Inteligentes
- Phases: 9, 10

### [SDGEU-157] Detalhes da Atração
- Phases: 8, 11, 12
