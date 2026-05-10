# Phase 10 Context: Central de Configurações & Preferências

## Overview
Esta fase implementa a central de configurações do usuário, permitindo a gestão de conta, privacidade, notificações e a reedição de preferências de viagem. A interface seguirá o design "Dark Premium" com grupos de ações bem definidos.

## Implementation Decisions

### 🛠️ Estrutura da UI (Baseada no Protótipo)
- **Organização**: Lista agrupada em containers arredondados (`rounded-2xl`) com fundo `surface-container-high`.
- **Navegação**: 
    - Acesso via ícone de engrenagem na tela de Perfil.
    - TopAppBar com botão de voltar e título centralizado "Configurações".
- **Ícones**: Utilizar `MaterialIcons` do `@expo/vector-icons` para manter consistência com o restante da app.

### ⚙️ Grupos de Configuração
1. **Experiência**:
    - **Preferências de Viagem**: Reabre o fluxo de onboarding para edição de interesses.
    - **Idioma e Região**: Exibição informativa (Mock inicial).
2. **Privacidade & Notificações**:
    - **Privacidade do Perfil**: Opções de visibilidade.
    - **Notificações**: Gestão de alertas de desafios e amigos.
3. **Segurança & Dados**:
    - **Segurança**: Fluxo de alteração de senha.
    - **Dados e Privacidade (LGPD)**: Exportação de dados (Mock) e Exclusão de conta (Ação destrutiva).

### 🚪 Ações de Conta
- **Sair da Conta**: Botão destacado no final da lista com a cor de erro (`error` / `#ffb4ab`).
- **Exclusão de Conta**: Deve solicitar uma confirmação via `Alert.alert` antes de processar.

## Technical Alignment
- **Reuso de Componentes**: 
    - Criar `SettingsItem.tsx` para os links da lista.
    - Criar `SettingsGroup.tsx` para os containers agrupados.
- **Re-onboarding**: A tela `preferences.tsx` deve ser atualizada para suportar o modo "Edição", alterando o texto do botão final e o comportamento de redirecionamento (voltar para configurações em vez de ir para o dashboard).

## Canonical Refs
- Protótipo HTML fornecido pelo usuário (Capturado no DISCUSSION-LOG.md).
- [preferences.tsx](file:///home/italo/Área de trabalho/explorae/frontend/src/app/preferences.tsx)

## Deferred Ideas
- Autenticação de dois fatores (2FA).
- Configurações específicas de acessibilidade (tamanho de fonte, etc).
