# UAT - Phase 7: Integração Filtros Backend

## 🧪 Casos de Teste de Aceitação

### 1. Busca por Texto
- **Passos**: Digitar "Praia" na barra de busca.
- **Esperado**: A lista carrega apenas atrações que contenham "Praia" no nome.

### 2. Filtro por Categoria
- **Passos**: Selecionar "Cultura" no carrossel.
- **Esperado**: A lista carrega apenas atrações da categoria Cultura.

### 3. Filtros Combinados
- **Passos**: Selecionar "Natureza" e aplicar filtro de Preço "$".
- **Esperado**: A lista mostra atrações de Natureza que sejam baratas ($).

### 4. Estado Vazio
- **Passos**: Buscar por algo inexistente (ex: "Xyz123").
- **Esperado**: Exibir a mensagem "Nenhum resultado encontrado".
