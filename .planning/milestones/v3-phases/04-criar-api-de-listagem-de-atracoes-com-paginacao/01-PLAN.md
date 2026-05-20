# Phase Plan - [SDGEU-215] Criar API de Listagem de Atrações com Paginação

## 📋 Overview
Este plano detalha a criação do endpoint paginado para listagem de atrações, garantindo a integração com o frontend e seguindo os padrões do projeto.

## 🛠️ Step-by-Step Implementation

### Step 1: Criação do DTO de Resposta
- Criar `br.edu.ifpb.explorae.api.dto.AttractionResponseDTO`.
- Mapear campos necessários da entidade `Attraction` (ID, Name, Category, ShortDescription, AverageRating, ImageUrl principal).

### Step 2: Implementação do Service
- Criar `br.edu.ifpb.explorae.service.AttractionService`.
- Implementar método `findAll(Pageable pageable)` que retorna `Page<AttractionResponseDTO>`.

### Step 3: Implementação do Controller
- Criar `br.edu.ifpb.explorae.api.controller.AttractionController`.
- Implementar `@GetMapping("/api/v1/attractions")`.
- Integrar com `StandardResponseDTO` para o retorno.

### Step 4: Configuração de Segurança
- Atualizar `SecurityConfig.java` para permitir acesso público ao endpoint `GET /api/v1/attractions`.

### Step 5: Testes de Integração
- Criar `br.edu.ifpb.explorae.api.controller.AttractionControllerTest`.
- Validar retorno HTTP 200 e estrutura da paginação.

## 🧪 Verification Plan

### Automated Tests
- Executar `./mvnw test` focado no `AttractionControllerTest`.

### Manual Verification (UAT)
- [ ] Chamar `GET /api/v1/attractions?page=0&size=5` via Postman/Curl.
- [ ] Verificar se as imagens estão sendo retornadas corretamente.

## 🔗 Dependencies
- Spring Boot Starter Web
- Spring Data JPA
- Project Lombok
