# UAT - Phase 6: [SDGEU-221] Interface de Filtros e Categorias

## 🧪 Casos de Teste de Aceitação

### 1. Barra de Busca
- **Cenário**: Usuário interage com o campo de busca.
- **Passos**:
    1. Tocar no campo de busca.
    2. Digitar "Farol".
    3. Tocar no botão "X" (clear).
- **Esperado**: O teclado abre corretamente, o texto é exibido, e o botão de limpar remove o conteúdo.

### 2. Carrossel de Categorias
- **Cenário**: Seleção de categorias.
- **Passos**:
    1. Rolar o carrossel horizontalmente.
    2. Tocar na categoria "Natureza".
    3. Tocar na categoria "Cultura".
- **Esperado**: O scroll é fluido. Apenas uma categoria fica "ativa" (com destaque visual: cor primária no ícone ou fundo) por vez.

### 3. Modal de Filtros
- **Cenário**: Abrir e configurar filtros.
- **Passos**:
    1. Tocar no botão "Filtros" no feed "Descubra".
    2. Alterar o slider de distância.
    3. Selecionar o preço "$$".
    4. Tocar em "Limpar".
    5. Tocar em "Aplicar Filtros".
- **Esperado**: O modal abre sem travar. O botão "Limpar" reseta os campos. O botão "Aplicar" fecha o modal.

### 4. Consistência Visual
- **Cenário**: Verificar design em modo escuro.
- **Esperado**: Todos os novos componentes (SearchBar, Modal) seguem a paleta do projeto (#00161e, #fd6c28) e apresentam legibilidade perfeita.

---

## ✅ Checklist de Validação Final
- [X] Nenhum aviso de "YellowBox" ou erro no console.
- [X] TypeScript compilando sem erros nos novos arquivos.
- [X] Espaçamento (padding/margin) consistente com o Dashboard.
