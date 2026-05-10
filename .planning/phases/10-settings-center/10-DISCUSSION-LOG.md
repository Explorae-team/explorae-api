# Discussion Log: Phase 10 — Central de Configurações & Preferências

## Status: Concluído
**Data:** 10 de maio de 2026
**Input do Usuário:** Protótipo HTML com design system completo.

## Áreas Discutidas

### 1. Interface e Identidade Visual
- **Decisão:** Seguir fielmente o protótipo HTML fornecido.
- **Destaque:** Uso de grupos (`SettingsGroup`) para separar categorias de configuração.
- **Cores:** Fundo `surface-container-high`, textos em `on-surface` e acentos em `primary`.

### 2. Re-onboarding (Interesses)
- **Decisão:** O item "Preferências de Viagem" deve levar à tela de preferências existente.
- **Nota técnica:** Implementar uma flag ou parâmetro de rota para diferenciar o Onboarding (primeiro acesso) da Edição (via configurações).

### 3. Ações Críticas (Sair/Excluir)
- **Sair:** Limpar `storage` e redirecionar para Login.
- **Excluir:** Implementar diálogo de confirmação visualmente claro.

## Protótipo de Referência (Resumo do HTML)
- Estrutura fixa de TopAppBar.
- Grupos: Experiência, Privacidade/Notificações, Segurança/Dados.
- Botão de Logout destacado no rodapé.
