# Guia de Referência de Comandos GSD (Get Shit Done)

Este documento atua como um guia prático e completo sobre todas as ferramentas e fluxos de trabalho do ecossistema **GSD** instalados no projeto **Exploraê**. Cada comando possui explicações funcionais e exemplos de uso reais integrados ao dia a dia do desenvolvimento do nosso MVP (Spring Boot + Expo + Supabase).

---

## 🏛️ Como Funciona o GSD?

O GSD (Get Shit Done) é um ecossistema de engenharia de contexto e desenvolvimento orientado a especificações. Ele ajuda a estruturar o desenvolvimento de software através de fases bem definidas: **Ideação ➔ Especificação ➔ Planejamento ➔ Execução ➔ Validação ➔ Merge (Ship)**.

---

## 📁 Categorias de Comandos

1. [Inicialização e Gestão de Projetos (Project Setup & Lifecycle)](#1-inicialização-e-gestão-de-projetos)
2. [Mapeamento e Contexto de Código (Codebase Mapping & Intelligence)](#2-mapeamento-e-contexto-de-código)
3. [Ideação, Sketch e Prototipação (Ideation & Prototyping)](#3-ideação-sketch-e-prototipação)
4. [Planejamento e Ciclo de Fases (Phase Planning & Lifecycle)](#4-planejamento-e-ciclo-de-fases)
5. [Qualidade de Código, Testes e Auditoria (Quality Gates & Testing)](#5-qualidade-de-código-testes-e-auditoria)
6. [Gestão de Tarefas, Rollbacks e Shipping (Execution & Release)](#6-gestão-de-tarefas-rollbacks-e-shipping)
7. [Configuração, Utilitários e Automação (Settings & Utility)](#7-configuração-utilitários-e-automação)

---

## 1. Inicialização e Gestão de Projetos

Comandos focados no ciclo de vida de alto nível do projeto, desde o nascimento até a conclusão de grandes entregas (Milestones).

| Comando | O que faz |
| :--- | :--- |
| **`gsd-new-project`** | Inicializa a governança GSD na pasta do projeto, criando a estrutura básica e o arquivo central `PROJECT.md`. |
| **`gsd-new-milestone`** | Abre um novo ciclo de desenvolvimento no projeto (ex: MVP Sprint 3), definindo as metas e promovendo as fases associadas do backlog. |
| **`gsd-complete-milestone`** | Finaliza e arquiva a Milestone atual quando todas as fases planejadas estão com status concluído, gerando relatórios de fechamento. |
| **`gsd-milestone-summary`** | Consolida um resumo histórico contendo todas as conquistas, decisões tomadas e modificações chaves de uma Milestone concluída. |
| **`gsd-stats`** | Exibe métricas de saúde do projeto, contagem de fases, progresso das atividades, arquivos alterados e evolução da produtividade. |
| **`gsd-workspace`** | Cria e gerencia múltiplos workspaces isolados para trabalhar em diferentes contextos ou features simultaneamente sem interferências. |

### 💡 Exemplos de Casos de Uso:

*   **`gsd-new-project`**: 
    *   *Caso:* Você acabou de clonar a pasta vazia do Exploraê e precisa estruturar a pasta de governança.
    *   *Exemplo:* `@[/gsd-new-project] "Construir o MVP do Exploraê com backend Java no Coolify e app mobile/web no Expo"`
*   **`gsd-new-milestone`**: 
    *   *Caso:* A equipe concluiu o Onboarding e agora vai iniciar a construção do Feed principal e curtidas de atrações.
    *   *Exemplo:* `@[/gsd-new-milestone] "Sprint 3: Construção do Feed Explore Dinâmico"`
*   **`gsd-stats`**:
    *   *Caso:* Entender o progresso atual do projeto antes de uma reunião com stakeholders.
    *   *Exemplo:* `@[/gsd-stats]`

---

## 2. Mapeamento e Contexto de Código

Comandos criados para ler, compreender e catalogar a estrutura técnica e de negócios de projetos existentes (Brownfield).

| Comando | O que faz |
| :--- | :--- |
| **`gsd-map-codebase`** | Varre a estrutura física de arquivos, bibliotecas e dependências, escrevendo a documentação inicial do projeto na pasta `.planning/codebase/`. |
| **`gsd-graphify`** | Analisa o código-fonte para construir um grafo de dependências funcionais e de fluxo do sistema, facilitando a navegação contextual rápida. |
| **`gsd-ingest-docs`** | Importa e unifica documentações e esquemas existentes no repositório (ex: diagramas de banco, READMEs) para a base conceitual do GSD. |
| **`gsd-docs-update`** | Varre o código recente e atualiza automaticamente as referências e especificações técnicas de documentação a fim de evitar dados desatualizados. |
| **`gsd-ns-context`** | Comando guarda-chuva (namespace) que unifica ações do escopo de inteligência de contexto, mapeamentos e grafos do repositório. |

### 💡 Exemplos de Casos de Uso:

*   **`gsd-map-codebase`**:
    *   *Caso:* Mapear a integração existente do Supabase e as convenções do monorepo.
    *   *Exemplo:* `@[/gsd-map-codebase] --fast --focus=tech`
*   **`gsd-ingest-docs`**:
    *   *Caso:* Consolidar o PRD original de turismo e gamificação dentro do diretório de planejamento.
    *   *Exemplo:* `@[/gsd-ingest-docs] @docs/prd-turismo-game.md`

---

## 3. Ideação, Sketch e Prototipação

Comandos ideais para a fase de descoberta ("Discovery"), onde se explora caminhos arquiteturais ou de interface antes de escrever o código de produção definitivo.

| Comando | O que faz |
| :--- | :--- |
| **`gsd-explore`** | Realiza um diálogo socrático de alto nível focado em avaliar ideias, arquiteturas, prós e contras de cada caminho antes de criar planos. |
| **`gsd-sketch`** | Cria rapidamente protótipos de interfaces, telas ou fluxos visuais descartáveis em HTML/CSS para validação visual rápida do design com o usuário. |
| **`gsd-spike`** | Permite criar um ambiente isolado de código ("spike sandbox") para realizar testes e experimentos rápidos de algoritmos sem poluir o código principal. |
| **`gsd-capture`** | Registra insights, ideias de novas funcionalidades e melhorias diretamente no backlog de sementes sem interromper o fluxo de trabalho ativo. |
| **`gsd-ns-ideate`** | Namespace que reúne as skills do grupo de ideação e experimentos de design de software (sketch, explore, capture). |

### 💡 Exemplos de Casos de Uso:

*   **`gsd-explore`**:
    *   *Caso:* Discutir a melhor estratégia para cachear as imagens de atrações no celular (usar cache local agressivo vs. baixar em demanda).
    *   *Exemplo:* `@[/gsd-explore] "Como estruturar o cache local do Expo Image de forma resiliente?"`
*   **`gsd-sketch`**:
    *   *Caso:* Criar uma visualização mockup rápida e estonteante do painel de XP e Badges do Perfil do Explorador.
    *   *Exemplo:* `@[/gsd-sketch] "Crie uma tela de perfil com gamificação no padrão Glassmorphism e gradientes vibrantes em roxo e amarelo"`
*   **`gsd-spike`**:
    *   *Caso:* Experimentar a biblioteca `Bucket4j` de forma isolada para ver o comportamento do rate limit antes de adicioná-la aos controllers de produção.
    *   *Exemplo:* `@[/gsd-spike] "Criar endpoint simples Spring Boot com rate limit de 3 chamadas por minuto"`

---

## 4. Planejamento e Ciclo de Fases

O coração do desenvolvimento GSD. Estes comandos organizam como as features serão implementadas, validadas e testadas através de contratos claros.

| Comando | O que faz |
| :--- | :--- |
| **`gsd-spec-phase`** | Analisa o objetivo de uma fase e gera a especificação clara (**`SPEC.md`**) do que será entregue, removendo ambiguidades técnicas. |
| **`gsd-ui-phase`** | Gera uma especificação e contrato de interface visual (**`UI-SPEC.md`**) detalhando cores, fluxos, estados de erro e regras de layout. |
| **`gsd-ai-integration-phase`** | Elabora um contrato técnico focado em fluxos de IA (**`AI-SPEC.md`**) descrevendo prompts, modelos, custos estimados e limites (tokens). |
| **`gsd-discuss-phase`** | Realiza perguntas inteligentes e refinadas para coletar contexto de negócio com o usuário antes de avançar para a escrita dos planos. |
| **`gsd-mvp-phase`** | Realiza a quebra de requisitos complexos em pequenas fatias verticais de valor direto ao usuário final (MVP Slice) a fim de agilizar entregas. |
| **`gsd-plan-phase`** | Escreve o plano passo a passo (**`PLAN.md`**) estruturando a execução em lotes de commits, critérios de aceitação e métodos de teste. |
| **`gsd-plan-review-convergence`** | Loop de replanejamento acionado automaticamente que reescreve planos até sanar todas as preocupações levantadas por revisores externos. |
| **`gsd-review`** | Envia os planos de desenvolvimento (`PLAN.md`) para que outras IAs realizem a revisão por pares, apontando brechas de segurança ou lógica. |
| **`gsd-execute-phase`** | Executa autonomamente e de forma paralelizada todas as tarefas planejadas em `PLAN.md` que foram pré-aprovadas pelo desenvolvedor. |
| **`gsd-pause-work`** | Congela o estado de desenvolvimento atual, salvando um relatório de andamento para que o trabalho seja retomado no ponto exato mais tarde. |
| **`gsd-resume-work`** | Lê o contexto salvo pelo comando pause, reorientando e restabelecendo o fluxo de trabalho ativo do desenvolvedor instantaneamente. |
| **`gsd-phase`** | Realiza alterações diretas e manipulações CRUD na listagem de fases descritas em seu arquivo de roadmap principal (`ROADMAP.md`). |
| **`gsd-ultraplan-phase`** | [BETA] Terceiriza o processo de planejamento complexo enviando o escopo à nuvem do Claude Code para uma análise hiper-detalhada. |
| **`gsd-ns-workflow`** | Namespace central que agrupa e orquestra a transição de fases (discuss -> spec -> plan -> execute -> verify). |

### 💡 Exemplos de Casos de Uso:

*   **`gsd-spec-phase`**:
    *   *Caso:* Especificar exatamente os campos e validações para o formulário de cadastro de nova atração turística.
    *   *Exemplo:* `@[/gsd-spec-phase] "Especificar o fluxo e endpoint de cadastro de atração"`
*   **`gsd-plan-phase`**:
    *   *Caso:* Criar o plano de codificação para salvar uma atração favorita associada ao usuário Logado no Supabase.
    *   *Exemplo:* `@[/gsd-plan-phase] "Planejar o salvamento de atrações favoritas com endpoints Java e telas no Expo"`
*   **`gsd-execute-phase`**:
    *   *Caso:* Rodar o executor para programar automaticamente a lógica planejada nos DTOs e entidades.
    *   *Exemplo:* `@[/gsd-execute-phase]`

---

## 5. Qualidade de Código, Testes e Auditoria

Comandos de controle de qualidade (Quality Gates) que asseguram que o código gerado atenda a critérios rígidos de estabilidade e segurança.

| Comando | O que faz |
| :--- | :--- |
| **`gsd-code-review`** | Realiza varreduras minuciosas nos arquivos modificados buscando bugs, redundâncias, problemas de tipagem ou vazamentos de recursos. |
| **`gsd-add-tests`** | Gera automaticamente suítes completas de testes unitários ou de integração cobrindo os critérios de aceitação (UAT) de uma fase pronta. |
| **`gsd-audit-uat`** | Audita todas as verificações físicas e garante que os critérios UAT acordados no plano foram de fato validados e concluídos com sucesso. |
| **`gsd-verify-work`** | Abre uma conversa interativa e didática orientando a realização manual de testes de aceitação e funcionamento da feature construída. |
| **`gsd-ui-review`** | Varre a interface construída e realiza uma auditoria rigorosa de usabilidade, cores, alinhamentos e responsividade baseada em 6 pilares de UI. |
| **`gsd-secure-phase`** | Realiza a modelagem de ameaças e audita a segurança do código entregue de forma retroativa, buscando mitigar vulnerabilidades comuns. |
| **`gsd-validate-phase`** | Executa testes físicos adicionais e garante que não restaram inconsistências lógicas no código após a conclusão dos trabalhos. |
| **`gsd-eval-review`** | Avalia a cobertura global do sistema de validação das features que envolvem modelos e integrações com mecanismos de IA. |
| **`gsd-ns-review`** | Namespace focado no processo de garantia de qualidade, debugger persistente, code review e validação estética (UI). |

### 💡 Exemplos de Casos de Uso:

*   **`gsd-add-tests`**:
    *   *Caso:* Você acabou de implementar o serviço de progressão de nível baseado no cálculo $Nivel \times 100\text{ XP}$ e precisa de testes automatizados.
    *   *Exemplo:* `@[/gsd-add-tests] "Criar testes de cálculo de nível e concessão de XP no service de gamificação"`
*   **`gsd-ui-review`**:
    *   *Caso:* Auditar a tela de Onboarding de interesses no frontend Expo para garantir que o contraste de cores das tags selecionadas está correto na Web e no Mobile.
    *   *Exemplo:* `@[/gsd-ui-review] "Auditar design da tela de preferências (/preferences)"`

---

## 6. Gestão de Tarefas, Rollbacks e Shipping

Comandos responsáveis pela fase final de empacotamento, envio de código (PRs) e ações de segurança no repositório local.

| Comando | O que faz |
| :--- | :--- |
| **`gsd-inbox`** | Realiza a triagem e avaliação das últimas issues e PRs abertos no repositório contra as políticas de contribuição e templates do time. |
| **`gsd-review-backlog`** | Reavalia o backlog de tarefas e sementes do projeto para promover itens urgentes à milestone ativa do ciclo. |
| **`gsd-pr-branch`** | Gera uma branch limpa baseada nas alterações efetuadas, removendo todos os logs locais e arquivos internos temporários de planejamento GSD. |
| **`gsd-ship`** | Executa a validação final (Quality Gates) e cria o Pull Request oficial, preparando o merge seguro da feature no repositório principal. |
| **`gsd-undo`** | Permite reverter commits e alterações introduzidas por uma fase de modo extremamente seguro, mapeando dependências afetadas no processo. |
| **`gsd-cleanup`** | Arquiva e limpa resíduos de fases antigas e diretórios temporários acumulados para manter o workspace leve. |
| **`gsd-ns-manage`** | Namespace que gerencia fluxos operacionais de git branch, deploy de releases, tarefas do backlog e shipping. |

### 💡 Exemplos de Casos de Uso:

*   **`gsd-pr-branch`**:
    *   *Caso:* Separar o código de produção que integra o login JWT do histórico de execução e logs internos do GSD antes de submeter ao GitHub.
    *   *Exemplo:* `@[/gsd-pr-branch] "feat/jwt-auth-integration"`
*   **`gsd-undo`**:
    *   *Caso:* Um refactoring mal planejado de banco de dados causou conflitos com a branch master e você precisa reverter os commits da fase de forma segura.
    *   *Exemplo:* `@[/gsd-undo] "Desfazer commits da fase de migração de favoritos"`

---

## 7. Configuração, Utilitários e Automação

Ferramentas utilitárias para automatizar tarefas cotidianas e configurar o ecossistema GSD conforme suas necessidades de fluxo.

| Comando | O que faz |
| :--- | :--- |
| **`gsd-progress`** | O comando mais utilizado. Mostra o status atual da fase de trabalho e ajuda a avançar de etapa no desenvolvimento com rapidez. |
| **`gsd-auto`** | Dispara o fluxo autônomo completo do GSD (analisar objetivo, propor plano, codificar, testar e finalizar) com um único comando. |
| **`gsd-autonomous`** | Configura o GSD para rodar sequencialmente todas as fases cadastradas no Roadmap até concluir a Milestone. |
| **`gsd-manager`** | Abre uma central e dashboard interativo no console permitindo gerenciar o andamento de múltiplas fases do projeto. |
| **`gsd-thread`** | Gerencia e visualiza logs de conversas persistentes locais divididos por tópicos ou sprints. |
| **`gsd-quick`** | Executa tarefas pontuais pulando as etapas tradicionais de planejamento longo e specs para acelerar o desenvolvimento local. |
| **`gsd-fast`** | Executa tarefas microscópicas sem overhead de subagentes diretamente (ex: apenas criar um arquivo Mock simples). |
| **`gsd-settings`** / **`gsd-config`** | Gerencia os comportamentos globais do GSD, chaves de API, profiles de LLM e regras de commit. |
| **`gsd-profile-user`** | Analisa o estilo de código do desenvolvedor e cria um perfil comportamental para que a IA se adapte perfeitamente à sua sintaxe e tom. |
| **`gsd-surface`** | Habilita ou desabilita a exposição visível de grupos de skills (profiles) para reduzir a latência de cold start da ferramenta. |
| **`gsd-update`** | Realiza o download e atualização do ecossistema GSD para a versão mais estável disponível. |
| **`gsd-health`** | Realiza diagnósticos rápidos e corrige inconsistências físicas na estrutura interna da pasta `.planning` do repositório. |
| **`gsd-forensics`** | Analisa logs extensos de erros e execuções catastróficas para identificar a causa raiz das quebras de build. |
| **`gsd-debug`** | Pipeline sistemático para depuração persistente que guarda estados de debug através de resets de contexto. |

### 💡 Exemplos de Casos de Uso:

*   **`gsd-progress`**:
    *   *Caso:* Você concluiu as edições do backend e quer avançar a fase para a etapa de validação manual.
    *   *Exemplo:* `@[/gsd-progress]`
*   **`gsd-quick`**:
    *   *Caso:* Fazer um ajuste simples no texto de placeholder da tela de recuperar senha que não exige um plano complexo.
    *   *Exemplo:* `@[/gsd-quick] "Corrigir placeholder do e-mail no formulário de recuperar-senha.tsx"`
*   **`gsd-profile-user`**:
    *   *Caso:* Garantir que a IA escreva comentários sempre em português do Brasil e no mesmo tom de desenvolvimento que você utiliza no Spring Boot.
    *   *Exemplo:* `@[/gsd-profile-user]`
