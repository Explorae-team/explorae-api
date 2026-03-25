# Product Requirements Document (PRD)
# Aplicativo de Turismo Gamificado

**Versão:** 1.0  
**Data:** 09 de Fevereiro de 2026  
**Status:** Draft - Em Revisão  
**Autor:** Product Team  
**Participantes:** Product Owner, Equipe de Desenvolvimento, Stakeholders

---

## Sumário Executivo

### Visão do Produto
Criar um aplicativo mobile de turismo gamificado que transforme a experiência de exploração turística em uma jornada interativa, segura e recompensadora, conectando turistas a experiências locais autênticas através de recomendações personalizadas, rotas otimizadas e elementos de gamificação que incentivam a exploração e fidelização.

### Proposta de Valor
- **Para Turistas:** Experiência de viagem personalizada, segura e gamificada que transforma exploração em aventura recompensadora
- **Para Estabelecimentos:** Canal direto de marketing e aquisição de clientes turistas através de parcerias
- **Para o Negócio:** Plataforma escalável de monetização via comissões de parceiros e recursos premium

### Objetivos de Negócio
1. **Curto Prazo (3-6 meses):** 
   - Lançar MVP com funcionalidades core (recomendações, rotas, gamificação básica)
   - Adquirir 10.000 usuários ativos mensais
   - Estabelecer 50 parcerias com restaurantes e estabelecimentos turísticos

2. **Médio Prazo (6-12 meses):**
   - Aumentar engajamento para 40% de usuários ativos diários
   - Expandir para 3 destinos turísticos principais
   - Gerar receita recorrente através de comissões de parceiros

3. **Longo Prazo (12-24 meses):**
   - Alcançar 100.000 usuários ativos mensais
   - Tornar-se referência em turismo gamificado no mercado brasileiro
   - Taxa de retenção de 60% após 30 dias

### Métricas de Sucesso (KPIs)
- **Engajamento:** DAU/MAU > 40%, Tempo médio no app > 15min/dia
- **Gamificação:** 70% dos usuários completam pelo menos 1 desafio por semana
- **Conversão:** 15% dos usuários visitam estabelecimentos parceiros via app
- **Retenção:** 60% retenção D30, 40% retenção D90
- **Satisfação:** NPS > 50, Rating na loja > 4.5 estrelas

---

## 1. Contexto e Justificativa

### 1.1 Problema a Resolver

**Pain Points dos Turistas:**
1. **Desorientação:** Dificuldade em encontrar atrações autênticas além dos pontos turísticos óbvios
2. **Falta de Personalização:** Recomendações genéricas que não consideram preferências individuais
3. **Insegurança:** Incerteza sobre segurança, preços justos e qualidade dos estabelecimentos
4. **Planejamento Fragmentado:** Necessidade de usar múltiplos apps para rotas, recomendações e avaliações
5. **Baixo Engajamento:** Apps de turismo são usados apenas pontualmente, sem criar hábito

**Oportunidade de Mercado:**
- Mercado de turismo digital brasileiro crescendo 23% ao ano[1]
- 89% dos viajantes usam smartphones para planejar viagens[2]
- Apps gamificados apresentam 47% maior retenção que apps tradicionais[3]
- Turistas gastam em média 30% mais quando orientados por recomendações personalizadas[4]

### 1.2 Solução Proposta

Aplicativo mobile que combina:
- **Inteligência de Recomendação:** Sistema de preferências + machine learning para sugestões personalizadas
- **Navegação Integrada:** Rotas multimodais (a pé, ônibus, Uber) com tempos estimados
- **Gamificação Estratégica:** Sistema de pontos, desafios, badges e recompensas que incentivam exploração
- **Parcerias Locais:** Marketplace de experiências com restaurantes, lojas e atrações
- **Segurança e Confiança:** Avaliações verificadas, alertas de segurança e suporte em tempo real

---

## 2. User Personas

### Persona 1: Marina - A Exploradora Digital
**Demografia:**
- Idade: 28 anos
- Profissão: Designer Gráfica
- Localização: São Paulo
- Renda: R$ 5.000/mês

**Comportamento de Viagem:**
- Viaja 3-4 vezes por ano
- Prefere destinos culturais e gastronômicos
- Busca experiências autênticas, não turismo de massa
- Ativa nas redes sociais, compartilha experiências

**Motivações:**
- Descobrir lugares únicos e "instagramáveis"
- Experimentar culinária local autêntica
- Conectar-se com cultura local
- Otimizar tempo de viagem

**Frustrações:**
- "Sinto que sempre caio nas armadilhas turísticas"
- "Perco muito tempo planejando rotas entre atrações"
- "Não sei se os lugares são seguros para ir sozinha"

**Objetivos no App:**
- Receber recomendações personalizadas baseadas em seu gosto
- Encontrar rotas eficientes entre pontos de interesse
- Ganhar recompensas por explorar lugares novos
- Compartilhar descobertas com amigos

---

### Persona 2: Carlos - O Viajante Família
**Demografia:**
- Idade: 42 anos
- Profissão: Gerente de Vendas
- Localização: Belo Horizonte
- Renda: R$ 12.000/mês
- Família: Casado, 2 filhos (8 e 12 anos)

**Comportamento de Viagem:**
- Viagens familiares 2-3 vezes por ano
- Prioriza segurança e conforto
- Busca atividades para todas as idades
- Planeja com antecedência

**Motivações:**
- Criar memórias familiares especiais
- Encontrar atividades que agradem crianças e adultos
- Garantir segurança da família
- Otimizar orçamento de viagem

**Frustrações:**
- "Difícil encontrar lugares adequados para crianças"
- "Preços turísticos são sempre inflacionados"
- "Logística de transporte com família é complicada"

**Objetivos no App:**
- Filtrar recomendações por adequação familiar
- Ver reviews de outras famílias
- Planejar roteiros otimizados para minimizar deslocamentos
- Acessar ofertas e promoções de parceiros

---

### Persona 3: Juliana - A Mochileira Econômica
**Demografia:**
- Idade: 24 anos
- Profissão: Estudante Universitária
- Localização: Rio de Janeiro
- Renda: R$ 1.500/mês

**Comportamento de Viagem:**
- Viagens frequentes de fim de semana
- Orçamento limitado, busca opções econômicas
- Prefere transporte público
- Viaja sozinha ou com amigos

**Motivações:**
- Maximizar experiências com orçamento mínimo
- Conhecer pessoas locais
- Descobrir atrações gratuitas ou baratas
- Ganhar recompensas e descontos

**Frustrações:**
- "Difícil encontrar opções baratas que sejam boas"
- "Apps de viagem focam em turismo caro"
- "Transporte público é confuso em cidades novas"

**Objetivos no App:**
- Filtrar opções por preço (gratuito/barato)
- Rotas detalhadas de transporte público
- Ganhar pontos para trocar por descontos
- Participar de desafios e competições

---

## 3. User Stories e Casos de Uso

### 3.1 Épico: Onboarding e Personalização

#### US-001: Cadastro Inicial
**Como** turista novo no app  
**Quero** criar minha conta de forma rápida  
**Para que** eu possa começar a usar o aplicativo imediatamente

**Critérios de Aceitação:**
- [ ] Usuário pode se cadastrar via email, Google ou Apple
- [ ] Cadastro completo em no máximo 2 minutos
- [ ] Validação de email obrigatória
- [ ] Aceite de termos de uso e política de privacidade
- [ ] Redirecionamento automático para questionário de preferências

**Prioridade:** MUST HAVE  
**Estimativa:** 8 story points  
**Dependências:** Sistema de autenticação OAuth2

---

#### US-002: Questionário de Preferências
**Como** novo usuário  
**Quero** responder perguntas sobre minhas preferências de viagem  
**Para que** o app possa me oferecer recomendações personalizadas

**Critérios de Aceitação:**
- [ ] Questionário com 8-10 perguntas objetivas
- [ ] Categorias: tipo de atrações, culinária, orçamento, tipo de transporte, perfil de viagem
- [ ] Interface visual atrativa com ícones e cores
- [ ] Possibilidade de pular e completar depois
- [ ] Barra de progresso visível
- [ ] Resumo de perfil ao final

**Perguntas Sugeridas:**
1. Que tipo de experiências você prefere? (Cultura, Natureza, Gastronomia, Aventura, Compras, Vida Noturna)
2. Qual seu orçamento típico por dia? (Econômico, Moderado, Confortável, Premium)
3. Como prefere se locomover? (A pé, Transporte público, Uber/Taxi, Carro próprio)
4. Viaja sozinho, em casal ou família? (Solo, Casal, Família com crianças, Grupo de amigos)
5. Que tipo de comida gosta? (Local/Tradicional, Internacional, Vegetariana, Fast food)
6. Qual sua prioridade? (Economia, Experiências únicas, Conforto, Segurança)

**Prioridade:** MUST HAVE  
**Estimativa:** 13 story points

---

### 3.2 Épico: Recomendações Inteligentes

#### US-003: Descobrir Atrações
**Como** turista  
**Quero** ver recomendações personalizadas de lugares para visitar  
**Para que** eu possa descobrir atrações alinhadas com meu perfil

**Critérios de Aceitação:**
- [ ] Feed principal exibe cards de recomendações
- [ ] Mínimo de 20 recomendações personalizadas
- [ ] Cada card mostra: foto, nome, categoria, distância, rating, preço estimado
- [ ] Filtros: tipo de atração, distância, preço, rating, horário funcionamento
- [ ] Opção de "gostei/não gostei" para melhorar algoritmo
- [ ] Botão "Ver detalhes" abre tela de informações completas
- [ ] Atualização em tempo real baseada em localização

**Algoritmo de Recomendação (v1):**
```
Score = (Peso_Preferência × Match_Perfil) + 
        (Peso_Proximidade × Fator_Distância) + 
        (Peso_Popularidade × Rating_Normalizado) + 
        (Peso_Novidade × Fator_Descoberta)

Pesos sugeridos:
- Preferência: 40%
- Proximidade: 30%
- Popularidade: 20%
- Novidade: 10%
```

**Prioridade:** MUST HAVE  
**Estimativa:** 21 story points

---

#### US-004: Detalhes da Atração
**Como** turista  
**Quero** ver informações detalhadas sobre uma atração  
**Para que** eu possa decidir se quero visitá-la

**Critérios de Aceitação:**
- [ ] Galeria de fotos (mínimo 5 fotos)
- [ ] Descrição completa em português
- [ ] Endereço com botão "Ver no mapa"
- [ ] Horário de funcionamento
- [ ] Faixa de preço
- [ ] Rating e número de avaliações
- [ ] Reviews dos usuários (top 5)
- [ ] Tempo médio de visita
- [ ] Dicas da comunidade
- [ ] Botões de ação: "Adicionar à rota", "Salvar", "Compartilhar"
- [ ] Informações de acessibilidade (quando disponível)
- [ ] Tags: família-friendly, pet-friendly, romântico, etc.

**Prioridade:** MUST HAVE  
**Estimativa:** 13 story points

---

### 3.3 Épico: Navegação e Rotas

#### US-005: Criar Rota Personalizada
**Como** turista  
**Quero** criar uma rota otimizada entre múltiplas atrações  
**Para que** eu possa visitar vários lugares de forma eficiente

**Critérios de Aceitação:**
- [ ] Usuário pode adicionar até 10 pontos de interesse em uma rota
- [ ] Sistema calcula rota otimizada (algoritmo do caixeiro viajante simplificado)
- [ ] Exibe tempo total estimado
- [ ] Mostra distância total
- [ ] Permite reordenar manualmente pontos
- [ ] Três opções de transporte: a pé, transporte público, Uber/99
- [ ] Para cada trecho mostra: tempo, distância, custo estimado (quando aplicável)
- [ ] Integração com Google Maps/Waze para navegação
- [ ] Opção de salvar rota para uso offline
- [ ] Notificações de proximidade ao chegar em cada ponto

**Prioridade:** MUST HAVE  
**Estimativa:** 21 story points  
**Dependências:** Google Maps API, APIs de transporte público local

---

#### US-006: Navegação em Tempo Real
**Como** turista  
**Quero** ser guiado passo a passo até meu destino  
**Para que** eu não me perca durante o trajeto

**Critérios de Aceitação:**
- [ ] Mapa interativo com posição do usuário em tempo real
- [ ] Direções passo a passo (virar à direita, seguir reto, etc.)
- [ ] Notificações por voz (opcional)
- [ ] Indicação de pontos de referência importantes
- [ ] Alertas de desvios da rota
- [ ] Recálculo automático se usuário sair da rota
- [ ] Estimativa de tempo atualizada continuamente
- [ ] Modo offline com mapas pré-baixados
- [ ] Integração com transporte público: linhas, paradas, horários

**Para Transporte Público:**
- [ ] Nome e número da linha
- [ ] Parada de origem e destino
- [ ] Horário previsto do próximo veículo
- [ ] Alerta ao se aproximar da parada de descida
- [ ] Integração com apps de transporte local (quando disponível)

**Para Uber/99:**
- [ ] Botão direto para chamar carro
- [ ] Preço estimado antes de confirmar
- [ ] Deep link para apps de transporte

**Prioridade:** MUST HAVE  
**Estimativa:** 34 story points

---

### 3.4 Épico: Gamificação

#### US-007: Sistema de Pontos e Níveis
**Como** turista  
**Quero** ganhar pontos pelas minhas atividades no app  
**Para que** eu possa subir de nível e desbloquear recompensas

**Critérios de Aceitação:**
- [ ] Usuário ganha pontos por: visitar lugares, avaliar estabelecimentos, completar desafios, adicionar fotos, fazer check-in
- [ ] Sistema de níveis: Bronze, Prata, Ouro, Platina, Diamante (5 níveis)
- [ ] Cada nível requer quantidade crescente de XP
- [ ] Badge de nível visível no perfil
- [ ] Notificação ao subir de nível com animação
- [ ] Tela de progresso mostrando XP atual e próximo nível
- [ ] Histórico de pontos ganhos

**Estrutura de Pontos:**
- Check-in em atração: 10 XP
- Avaliação com review: 25 XP
- Upload de foto: 15 XP
- Completar desafio: 50-200 XP (varia por dificuldade)
- Adicionar dica útil: 20 XP
- Convidar amigo que se cadastra: 100 XP
- Visitar parceiro e usar código do app: 30 XP

**Níveis:**
- Bronze: 0-500 XP
- Prata: 501-2000 XP
- Ouro: 2001-5000 XP
- Platina: 5001-10000 XP
- Diamante: 10001+ XP

**Prioridade:** MUST HAVE  
**Estimativa:** 21 story points

---

#### US-008: Desafios e Missões
**Como** turista  
**Quero** participar de desafios temáticos  
**Para que** eu possa tornar minha viagem mais divertida e ganhar recompensas

**Critérios de Aceitação:**
- [ ] Três tipos de desafios: Diários, Semanais, Especiais
- [ ] Desafios Diários: 2-3 novos por dia, simples e rápidos (ex: "Visite 1 restaurante local")
- [ ] Desafios Semanais: 3-5 por semana, mais complexos (ex: "Experimente 5 pratos típicos diferentes")
- [ ] Desafios Especiais: Eventos sazonais, parcerias, marcos da cidade
- [ ] Cada desafio mostra: título, descrição, progresso, recompensa, prazo
- [ ] Notificação ao completar desafio
- [ ] Recompensas: XP bônus, badges exclusivos, cupons de parceiros
- [ ] Ranking de desafios completados (opcional, competição entre amigos)

**Exemplos de Desafios:**

*Diários:*
- "Explorador Matinal" - Faça check-in em uma atração antes das 10h
- "Crítico Gourmet" - Avalie um restaurante que visitou
- "Fotógrafo da Vez" - Adicione 3 fotos a lugares diferentes

*Semanais:*
- "Conhecedor Cultural" - Visite 3 museus ou centros culturais
- "Aventura Gastronômica" - Experimente 5 tipos de culinária diferentes
- "Colecionador de Vistas" - Visite 3 mirantes diferentes

*Especiais:*
- "Festival Junino" - Visite 5 festas juninas durante o mês de junho
- "Rota do Café" - Complete a rota de 10 cafeterias especiais
- "Maratona de Natal" - Visite decorações natalinas em 7 shopping centers

**Prioridade:** MUST HAVE  
**Estimativa:** 21 story points

---

#### US-009: Badges e Conquistas
**Como** turista  
**Quero** colecionar badges pelas minhas conquistas  
**Para que** eu possa mostrar minhas experiências e me sentir recompensado

**Critérios de Aceitação:**
- [ ] Sistema de badges em categorias: Exploração, Gastronomia, Cultura, Social, Especiais
- [ ] Mínimo de 30 badges diferentes
- [ ] Cada badge tem: ícone, nome, descrição, raridade (comum, raro, épico, lendário)
- [ ] Tela de coleção mostrando badges conquistados e bloqueados
- [ ] Animação especial ao desbloquear badge
- [ ] Badges podem ser exibidos no perfil (máximo 5 em destaque)
- [ ] Notificação push ao ganhar badge
- [ ] Compartilhamento social de badges desbloqueados

**Exemplos de Badges:**

*Exploração:*
- "Primeiro Passo" (comum) - Complete seu primeiro check-in
- "Explorador Local" (raro) - Visite 10 atrações em uma cidade
- "Desbravador" (épico) - Visite 5 cidades diferentes
- "Globetrotter" (lendário) - Visite 20 cidades diferentes

*Gastronomia:*
- "Provador" (comum) - Avalie 5 restaurantes
- "Gourmet" (raro) - Experimente 10 tipos de culinária diferentes
- "Master Chef" (épico) - Visite restaurantes em 5 cidades diferentes
- "Crítico Gastronômico" (lendário) - Escreva 50 avaliações de restaurantes

*Cultura:*
- "Curioso" (comum) - Visite seu primeiro museu
- "Apreciador de Arte" (raro) - Visite 5 museus diferentes
- "Historiador" (épico) - Complete a rota histórica de 3 cidades
- "Guardião da Cultura" (lendário) - Visite 20 pontos culturais

*Social:*
- "Amigável" (comum) - Adicione seu primeiro amigo
- "Influenciador" (raro) - Tenha 10 amigos seguindo você
- "Embaixador" (épico) - Convide 5 amigos que se cadastram
- "Celebridade" (lendário) - Tenha 50 seguidores

**Prioridade:** SHOULD HAVE  
**Estimativa:** 13 story points

---

#### US-010: Ranking e Competições
**Como** turista  
**Quero** competir com outros usuários em rankings  
**Para que** eu possa me desafiar e ter motivação extra para explorar

**Critérios de Aceitação:**
- [ ] Rankings separados: Global, Por Cidade, Amigos
- [ ] Atualização semanal dos rankings
- [ ] Top 100 usuários por categoria
- [ ] Categorias: Total XP, Desafios Completados, Check-ins, Avaliações
- [ ] Perfil mostra posição atual no ranking
- [ ] Recompensas especiais para top 10 de cada categoria
- [ ] Competições mensais temáticas com prêmios
- [ ] Notificação ao entrar no top 100

**Prioridade:** COULD HAVE  
**Estimativa:** 13 story points

---

### 3.5 Épico: Parcerias e Marketplace

#### US-011: Descobrir Parceiros
**Como** turista  
**Quero** encontrar estabelecimentos parceiros com ofertas especiais  
**Para que** eu possa aproveitar descontos e benefícios exclusivos

**Critérios de Aceitação:**
- [ ] Seção "Parceiros" no menu principal
- [ ] Badge "Parceiro Oficial" em estabelecimentos parceiros
- [ ] Filtro para ver apenas parceiros
- [ ] Cards destacam benefício exclusivo (ex: "10% de desconto")
- [ ] Informações do parceiro: nome, categoria, endereço, benefício, validade
- [ ] Código QR ou cupom digital para resgatar benefício
- [ ] Contador de quantas pessoas usaram a oferta
- [ ] Avaliações específicas de usuários que usaram benefício

**Prioridade:** MUST HAVE  
**Estimativa:** 13 story points

---

#### US-012: Resgatar Benefício
**Como** turista  
**Quero** resgatar benefícios de parceiros facilmente  
**Para que** eu possa aproveitar descontos durante minha visita

**Critérios de Aceitação:**
- [ ] Botão "Usar Benefício" na página do parceiro
- [ ] Gera código QR único e de uso único
- [ ] Timer de validade do código (15 minutos)
- [ ] Instruções claras de como usar no estabelecimento
- [ ] Estabelecimento pode escanear QR para validar
- [ ] Usuário ganha XP bônus ao usar benefício (30 XP)
- [ ] Sistema registra uso para analytics
- [ ] Histórico de benefícios resgatados
- [ ] Possibilidade de avaliar após usar benefício

**Prioridade:** MUST HAVE  
**Estimativa:** 21 story points  
**Dependências:** Sistema de QR code, validação em tempo real

---

#### US-013: Sistema de Recompensas
**Como** turista  
**Quero** trocar meus pontos por recompensas tangíveis  
**Para que** eu tenha incentivo real para usar o app e explorar

**Critérios de Aceitação:**
- [ ] Loja de recompensas acessível pelo perfil
- [ ] Catálogo com no mínimo 20 recompensas
- [ ] Categorias: Descontos, Experiências Gratuitas, Upgrades, Produtos
- [ ] Cada recompensa mostra: custo em pontos, descrição, validade, parceiro
- [ ] Sistema de troca: usuário clica, confirma, pontos são debitados
- [ ] Gera voucher digital ou código para usar
- [ ] Notificação de expiração 3 dias antes
- [ ] Histórico de recompensas resgatadas

**Exemplos de Recompensas:**
- 500 pontos: 10% desconto em restaurante parceiro
- 1000 pontos: Entrada grátis em museu
- 1500 pontos: Tour guiado gratuito
- 2500 pontos: Upgrade de quarto em hotel parceiro
- 5000 pontos: Experiência premium (jantar especial, atividade exclusiva)

**Prioridade:** SHOULD HAVE  
**Estimativa:** 21 story points

---

### 3.6 Épico: Social e Comunidade

#### US-014: Avaliar e Revisar
**Como** turista  
**Quero** compartilhar minha experiência sobre lugares que visitei  
**Para que** eu possa ajudar outros turistas e ganhar reconhecimento

**Critérios de Aceitação:**
- [ ] Sistema de avaliação com estrelas (1-5)
- [ ] Review escrito (opcional, mínimo 50 caracteres)
- [ ] Upload de até 5 fotos por avaliação
- [ ] Tags predefinidas: Limpo, Atencioso, Boa comida, Bom custo-benefício, etc.
- [ ] Possibilidade de avaliar apenas após check-in verificado
- [ ] Reviews aparecem no perfil do usuário
- [ ] Reviews podem receber "útil" de outros usuários
- [ ] Usuários com mais reviews úteis ganham badge "Crítico Confiável"
- [ ] XP bônus por review completo (25 XP)

**Prioridade:** MUST HAVE  
**Estimativa:** 13 story points

---

#### US-015: Sistema de Amigos
**Como** turista  
**Quero** conectar com amigos no app  
**Para que** eu possa compartilhar experiências e competir

**Critérios de Aceitação:**
- [ ] Buscar amigos por nome de usuário, email ou contatos do telefone
- [ ] Enviar convite de amizade
- [ ] Aceitar/recusar convites
- [ ] Lista de amigos no perfil
- [ ] Feed mostrando atividades de amigos (check-ins, badges, reviews)
- [ ] Comparar estatísticas com amigos
- [ ] Enviar mensagem privada (opcional, fase 2)
- [ ] Ranking exclusivo entre amigos

**Prioridade:** SHOULD HAVE  
**Estimativa:** 13 story points

---

#### US-016: Compartilhamento Social
**Como** turista  
**Quero** compartilhar minhas conquistas nas redes sociais  
**Para que** eu possa mostrar minhas experiências de viagem

**Critérios de Aceitação:**
- [ ] Botão "Compartilhar" em: badges conquistados, check-ins, rotas completadas
- [ ] Integração com: Instagram, Facebook, WhatsApp, Twitter
- [ ] Imagem gerada automaticamente com branding do app
- [ ] Texto sugerido editável
- [ ] Link para download do app incluído
- [ ] Preview antes de compartilhar
- [ ] Analytics de compartilhamentos

**Prioridade:** SHOULD HAVE  
**Estimativa:** 8 story points

---

### 3.7 Épico: Segurança e Confiança

#### US-017: Alertas de Segurança
**Como** turista  
**Quero** receber alertas sobre segurança nas áreas que visitarei  
**Para que** eu possa me sentir seguro durante minha viagem

**Critérios de Aceitação:**
- [ ] Integração com dados de segurança pública (quando disponível)
- [ ] Níveis de segurança por região: Seguro, Atenção, Evitar
- [ ] Mapa de calor mostrando áreas por nível de segurança
- [ ] Notificação ao se aproximar de área com alertas
- [ ] Dicas de segurança contextualizadas
- [ ] Horários recomendados para visita
- [ ] Botão SOS para emergências (liga para número local de emergência)
- [ ] Opção de compartilhar localização em tempo real com contato de confiança

**Prioridade:** SHOULD HAVE  
**Estimativa:** 21 story points

---

#### US-018: Verificação de Estabelecimentos
**Como** turista  
**Quero** ter certeza de que as informações dos estabelecimentos são confiáveis  
**Para que** eu não tenha surpresas desagradáveis

**Critérios de Aceitação:**
- [ ] Badge "Verificado" para estabelecimentos auditados
- [ ] Informações atualizadas há menos de 30 dias
- [ ] Sistema de denúncia para informações incorretas
- [ ] Moderação de reviews suspeitos
- [ ] Validação de check-ins via geolocalização (raio máximo 100m)
- [ ] Fotos verificadas vs fotos de usuários claramente separadas

**Prioridade:** SHOULD HAVE  
**Estimativa:** 13 story points

---

### 3.8 Épico: Funcionalidades Auxiliares

#### US-019: Modo Offline
**Como** turista  
**Quero** acessar informações básicas sem internet  
**Para que** eu não fique perdido em áreas sem conexão

**Critérios de Aceitação:**
- [ ] Opção de baixar mapa de cidade para uso offline
- [ ] Dados salvos localmente: atrações salvas, rotas, informações básicas
- [ ] Navegação básica funciona offline com GPS
- [ ] Indicador visual de que está em modo offline
- [ ] Sincronização automática ao recuperar conexão
- [ ] Gestão de armazenamento (usuário escolhe o que baixar)

**Prioridade:** COULD HAVE  
**Estimativa:** 21 story points

---

#### US-020: Suporte e Ajuda
**Como** turista  
**Quero** obter ajuda rápida quando tiver problemas  
**Para que** eu possa resolver dúvidas sem interromper minha viagem

**Critérios de Aceitação:**
- [ ] FAQ com perguntas mais comuns
- [ ] Busca inteligente no FAQ
- [ ] Chat de suporte (bot + humano em horário comercial)
- [ ] Tutorial interativo para primeiros usuários
- [ ] Dicas contextuais (tooltips) em funcionalidades principais
- [ ] Central de ajuda acessível pelo menu
- [ ] Formulário de feedback
- [ ] Tempo máximo de resposta: 4h em dias úteis

**Prioridade:** SHOULD HAVE  
**Estimativa:** 13 story points

---

## 4. Requisitos Funcionais Detalhados

### 4.1 Módulo de Autenticação

**RF-001: Registro de Usuário**
- O sistema deve permitir cadastro via email e senha
- O sistema deve permitir cadastro via OAuth (Google, Apple, Facebook)
- Senha deve ter mínimo 8 caracteres, 1 maiúscula, 1 número
- Email de confirmação obrigatório
- Perfil inicial criado automaticamente

**RF-002: Login**
- Login via email/senha ou OAuth
- Opção "Lembrar-me" (token válido por 30 dias)
- Recuperação de senha via email
- Máximo 5 tentativas antes de bloqueio temporário (15 minutos)

**RF-003: Gestão de Perfil**
- Edição de: nome, foto, bio, preferências
- Visualização de: estatísticas, badges, nível, rankings
- Configurações de privacidade: perfil público/privado
- Configurações de notificações
- Exclusão de conta (com confirmação e período de 30 dias para reativação)

---

### 4.2 Módulo de Recomendações

**RF-004: Algoritmo de Recomendação**
- Entrada: perfil do usuário, localização atual, histórico de interações
- Processamento: cálculo de score de relevância para cada atração
- Saída: lista ordenada de recomendações
- Atualização: a cada mudança de localização > 500m ou a cada 30 minutos
- Machine Learning (Fase 2): Aprendizado com feedbacks (likes/dislikes)

**RF-005: Filtros de Busca**
- Categoria: Cultura, Natureza, Gastronomia, Compras, Aventura, Vida Noturna
- Distância: 500m, 1km, 5km, 10km, 20km+
- Preço: Grátis, $, $$, $$$, $$$$
- Rating: 3+, 4+, 4.5+
- Horário: Aberto agora, Abre em breve
- Outros: Acessível, Pet-friendly, Família-friendly

**RF-006: Busca Textual**
- Busca por nome de atração
- Busca por categoria
- Busca por localização (bairro, cidade)
- Autocompletar com sugestões
- Histórico de buscas recentes
- Busca fonética (suporta erros de digitação)

---

### 4.3 Módulo de Navegação

**RF-007: Criação de Rotas**
- Usuário pode adicionar múltiplos pontos de interesse
- Sistema calcula rota otimizada considerando:
  - Horário de funcionamento de cada local
  - Tempo médio de visita
  - Distância entre pontos
  - Modo de transporte preferido
- Permite reorganização manual da rota
- Salva rotas favoritas

**RF-008: Modos de Transporte**

*A Pé:*
- Calcula trajeto de pedestres
- Exibe tempo estimado (velocidade média: 5 km/h)
- Destaca pontos de interesse no caminho

*Transporte Público:*
- Integração com APIs de transporte local (quando disponível)
- Exibe: linhas disponíveis, horários, paradas, tempo de espera
- Calcula custo estimado da passagem
- Alertas de proximidade da parada de descida

*Uber/99:*
- Deep link para apps de transporte
- Exibe preço estimado
- Opção de salvar preferência de transporte

**RF-009: Navegação Turn-by-Turn**
- Instruções passo a passo
- Notificações por voz (opcional)
- Recálculo automático se desviar da rota
- Visualização 2D/3D do mapa
- Indicadores de: próxima ação, distância restante, tempo restante

---

### 4.4 Módulo de Gamificação

**RF-010: Sistema de XP e Níveis**
- Tabela de XP por ação (detalhada em US-007)
- Cálculo automático ao completar ação
- Barra de progresso no perfil
- Notificação ao subir de nível
- Histórico de XP ganhos

**RF-011: Desafios**
- Geração diária de 2-3 desafios simples
- Geração semanal de 3-5 desafios complexos
- Desafios especiais sazonais/eventos
- Sistema de progresso rastreável
- Notificação ao completar desafio
- Recompensas automáticas

**RF-012: Badges**
- Desbloqueio automático ao atingir critério
- Animação de conquista
- Armazenamento permanente
- Exibição em perfil
- Compartilhamento social

**RF-013: Rankings**
- Atualização semanal (toda segunda-feira às 00h)
- Cálculo separado por categoria
- Cache para performance
- Exibição de top 100
- Posição do usuário sempre visível

---

### 4.5 Módulo de Parcerias

**RF-014: Gestão de Parceiros**
- Cadastro de estabelecimentos parceiros
- Perfil de parceiro: nome, categoria, endereço, fotos, descrição
- Definição de benefícios: tipo (desconto, brinde, experiência), valor, validade
- Badge "Parceiro Oficial"
- Analytics para parceiros: visualizações, resgates, avaliações

**RF-015: Resgate de Benefícios**
- Geração de QR code único
- Validade de 15 minutos
- Validação em tempo real
- Registro de uso
- Prevenção de uso duplicado
- Notificação ao parceiro

**RF-016: Loja de Recompensas**
- Catálogo de recompensas
- Sistema de pontos como moeda
- Troca de pontos por recompensas
- Geração de vouchers
- Gestão de validade
- Histórico de resgates

---

### 4.6 Módulo Social

**RF-017: Sistema de Amigos**
- Busca de usuários
- Convite de amizade
- Gestão de solicitações
- Feed de atividades de amigos
- Comparação de estatísticas

**RF-018: Avaliações e Reviews**
- Rating de 1-5 estrelas
- Review textual (50-500 caracteres)
- Upload de fotos (máximo 5 por review)
- Tags predefinidas
- Sistema de utilidade (útil/não útil)
- Moderação automática + manual

**RF-019: Check-ins**
- Validação por geolocalização (raio 100m)
- Registro de data/hora
- XP automático
- Possibilidade de adicionar foto e comentário
- Compartilhamento social opcional

---

### 4.7 Módulo de Segurança

**RF-020: Alertas de Segurança**
- Integração com bases de dados de segurança
- Classificação de áreas: Seguro (verde), Atenção (amarelo), Evitar (vermelho)
- Notificações push ao entrar em área de risco
- Dicas de segurança contextualizadas
- Botão SOS: disca 190 (polícia) ou 193 (SAMU)

**RF-021: Compartilhamento de Localização**
- Usuário pode compartilhar localização em tempo real
- Define contato de confiança (email ou telefone)
- Link com mapa ao vivo (válido por tempo determinado)
- Opção de encerrar compartilhamento a qualquer momento

---

## 5. Requisitos Não-Funcionais

### 5.1 Performance

**RNF-001: Tempo de Resposta**
- Tela de recomendações: carrega em < 2 segundos
- Busca: retorna resultados em < 1 segundo
- Cálculo de rota: < 3 segundos para até 10 pontos
- Transições entre telas: < 300ms

**RNF-002: Escalabilidade**
- Sistema deve suportar 100.000 usuários simultâneos
- Arquitetura deve permitir escala horizontal
- Cache distribuído para reduzir carga no banco
- CDN para servir imagens e assets estáticos

**RNF-003: Disponibilidade**
- Uptime mínimo: 99.5% (máximo 3.6h de downtime por mês)
- Graceful degradation: funcionalidades core continuam operando mesmo com falhas parciais
- Monitoramento 24/7 com alertas automáticos

---

### 5.2 Segurança

**RNF-004: Autenticação e Autorização**
- Tokens JWT com expiração de 1h (access) e 30 dias (refresh)
- Armazenamento seguro de senhas: bcrypt com salt
- HTTPS obrigatório para todas as comunicações
- OAuth 2.0 para integrações de terceiros

**RNF-005: Proteção de Dados**
- Conformidade com LGPD (Lei Geral de Proteção de Dados)
- Criptografia de dados sensíveis em repouso (AES-256)
- Backup diário com retenção de 30 dias
- Anonimização de dados para analytics

**RNF-006: API Security**
- Rate limiting: 100 requisições/minuto por usuário
- Validação de entrada em todas as APIs
- Proteção contra SQL Injection, XSS, CSRF
- API Gateway com validação de tokens

---

### 5.3 Usabilidade

**RNF-007: Experiência do Usuário**
- Interface intuitiva: usuário deve conseguir realizar tarefas principais sem tutorial
- Consistência visual: seguir design system definido
- Feedback visual imediato para todas as ações
- Mensagens de erro claras e acionáveis

**RNF-008: Acessibilidade**
- Contraste mínimo WCAG AA (4.5:1)
- Textos alternativos para imagens
- Navegação por teclado (versão web)
- Suporte a leitores de tela
- Tamanhos de fonte ajustáveis

**RNF-009: Internacionalização**
- Suporte inicial: Português (pt-BR)
- Arquitetura preparada para múltiplos idiomas (i18n)
- Formato de data, hora e moeda localizados

---

### 5.4 Compatibilidade

**RNF-010: Plataformas Mobile**
- iOS: versões 14.0+
- Android: versões 8.0+ (API level 26+)
- Responsivo para tablets

**RNF-011: Navegadores Web (Admin/Parceiros)**
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

---

### 5.5 Manutenibilidade

**RNF-012: Código**
- Cobertura de testes: mínimo 80%
- Documentação de APIs (OpenAPI/Swagger)
- Code review obrigatório antes de merge
- CI/CD automatizado

**RNF-013: Monitoramento**
- Logging centralizado de erros
- Métricas de performance em tempo real
- Alertas automáticos para anomalias
- Dashboard de saúde do sistema

---

### 5.6 Conformidade Legal

**RNF-014: Regulamentações**
- LGPD: consentimento explícito para coleta de dados
- Política de Privacidade e Termos de Uso acessíveis
- Opção de exportar dados pessoais
- Opção de excluir conta e dados

---

## 6. Arquitetura do Sistema

### 6.1 Visão Geral da Arquitetura

```
┌─────────────────────────────────────────────────────────┐
│                   CLIENT LAYER                          │
├─────────────────────────────────────────────────────────┤
│  ┌────────────────┐  ┌────────────────┐                │
│  │  Mobile App    │  │  Web Admin     │                │
│  │  (React Native)│  │  (React)       │                │
│  └────────┬───────┘  └────────┬───────┘                │
│           │                    │                        │
│           └────────────┬───────┘                        │
│                        │                                │
│                   REST/GraphQL                          │
│                        │                                │
└────────────────────────┼────────────────────────────────┘
                         │
┌────────────────────────┼────────────────────────────────┐
│               API GATEWAY (Spring Cloud Gateway)        │
│         (Auth, Rate Limiting, Load Balancing)           │
└────────────────────────┼────────────────────────────────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
┌───────▼──────┐  ┌──────▼──────┐  ┌─────▼──────────┐
│ User Service │  │ Location    │  │ Gamification   │
│ (Spring Boot)│  │ Service     │  │ Service        │
│              │  │ (Spring Boot│  │ (Spring Boot)  │
│ - Auth       │  │             │  │                │
│ - Profile    │  │ - Places    │  │ - XP/Levels    │
│ - Preferences│  │ - Routes    │  │ - Challenges   │
└──────┬───────┘  │ - Navigation│  │ - Badges       │
       │          └──────┬──────┘  │ - Rankings     │
       │                 │          └─────┬──────────┘
       │                 │                │
┌──────▼──────┐  ┌───────▼──────┐  ┌─────▼──────────┐
│ Partner     │  │ Social       │  │ Notification   │
│ Service     │  │ Service      │  │ Service        │
│ (Spring Boot)  │ (Spring Boot)│  │ (Spring Boot)  │
│             │  │              │  │                │
│ - Partners  │  │ - Friends    │  │ - Push         │
│ - Benefits  │  │ - Reviews    │  │ - Email        │
│ - Rewards   │  │ - Check-ins  │  │ - SMS          │
└──────┬──────┘  └──────┬───────┘  └─────┬──────────┘
       │                │                 │
       └────────┬───────┴─────────────────┘
                │
┌───────────────▼──────────────────────────────────────┐
│            INFRASTRUCTURE LAYER                       │
├──────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌──────────────┐  ┌────────────┐  │
│  │ PostgreSQL  │  │ Redis        │  │ MongoDB    │  │
│  │ (Relational)│  │ (Cache/      │  │ (Logs/     │  │
│  │             │  │  Sessions)   │  │  Analytics)│  │
│  └─────────────┘  └──────────────┘  └────────────┘  │
│                                                       │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────┐  │
│  │ RabbitMQ    │  │ Elasticsearch│  │ S3/MinIO   │  │
│  │ (Message    │  │ (Search)     │  │ (Files/    │  │
│  │  Queue)     │  │              │  │  Images)   │  │
│  └─────────────┘  └──────────────┘  └────────────┘  │
└──────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────┐
│           EXTERNAL INTEGRATIONS                       │
├──────────────────────────────────────────────────────┤
│  - Google Maps API (Maps, Routes, Places)            │
│  - Firebase (Push Notifications)                     │
│  - AWS SES (Email)                                   │
│  - Payment Gateway (Stripe/PagSeguro)                │
│  - OAuth Providers (Google, Apple, Facebook)         │
│  - Transport APIs (Local public transport)           │
└──────────────────────────────────────────────────────┘
```

### 6.2 Stack Tecnológico

#### Backend
- **Framework:** Spring Boot 3.2+ (Java 17+)
- **API Style:** REST + GraphQL (para queries complexas)
- **ORM:** Spring Data JPA + Hibernate
- **Security:** Spring Security + JWT
- **API Gateway:** Spring Cloud Gateway
- **Service Discovery:** Spring Cloud Netflix Eureka (opcional para microservices)
- **Documentação:** SpringDoc OpenAPI 3

#### Frontend Mobile
- **Framework:** React Native (permite iOS + Android com código único)
- **State Management:** Redux Toolkit + RTK Query
- **Navigation:** React Navigation 6
- **UI Library:** React Native Paper + componentes customizados
- **Maps:** React Native Maps (Google Maps)
- **Push:** React Native Firebase
- **Local Storage:** AsyncStorage + SQLite (para offline)

#### Frontend Web (Admin/Parceiros)
- **Framework:** React 18 + TypeScript
- **Build Tool:** Vite
- **UI Library:** Material-UI (MUI) v5
- **State:** Redux Toolkit
- **Forms:** React Hook Form + Zod (validação)
- **Charts:** Recharts

#### Banco de Dados
- **Principal:** PostgreSQL 15+ (dados relacionais: usuários, lugares, reviews)
- **Cache:** Redis 7+ (sessões, rankings, dados temporários)
- **Logs/Analytics:** MongoDB 6+ (eventos, analytics, logs não estruturados)
- **Search:** Elasticsearch 8+ (busca textual de lugares)

#### Mensageria
- **Message Broker:** RabbitMQ (para processamento assíncrono)
- **Casos de Uso:** envio de notificações, cálculo de rankings, processamento de gamificação

#### Storage
- **Files/Images:** AWS S3 ou MinIO (self-hosted)
- **CDN:** CloudFlare ou AWS CloudFront

#### DevOps
- **Containerização:** Docker + Docker Compose
- **Orquestração:** Kubernetes (produção) ou Docker Swarm (staging)
- **CI/CD:** GitHub Actions ou GitLab CI
- **Monitoramento:** Prometheus + Grafana
- **Logging:** ELK Stack (Elasticsearch, Logstash, Kibana)
- **APM:** New Relic ou Datadog

---

## 7. Modelo de Dados

### 7.1 Diagrama Entidade-Relacionamento (Resumido)

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│    User     │────────<│   Review     │>────────│   Place     │
├─────────────┤         ├──────────────┤         ├─────────────┤
│ id          │         │ id           │         │ id          │
│ email       │         │ user_id (FK) │         │ name        │
│ password    │         │ place_id (FK)│         │ description │
│ name        │         │ rating       │         │ category    │
│ avatar_url  │         │ comment      │         │ latitude    │
│ xp          │         │ photos[]     │         │ longitude   │
│ level       │         │ created_at   │         │ address     │
│ created_at  │         └──────────────┘         │ price_level │
└─────────────┘                                  │ rating_avg  │
      │                                          │ photos[]    │
      │                                          │ hours       │
      │                                          │ is_partner  │
      │                                          └─────────────┘
      │                                                 │
      │                                                 │
      │         ┌──────────────┐                       │
      └────────<│   CheckIn    │>──────────────────────┘
                ├──────────────┤
                │ id           │
                │ user_id (FK) │
                │ place_id (FK)│
                │ timestamp    │
                │ photo_url    │
                │ comment      │
                └──────────────┘

┌─────────────┐         ┌──────────────┐
│    User     │────────<│  UserBadge   │>────┐
└─────────────┘         ├──────────────┤     │
                        │ id           │     │
                        │ user_id (FK) │     │
                        │ badge_id (FK)│     │
                        │ earned_at    │     │
                        └──────────────┘     │
                                             │
                        ┌──────────────┐     │
                        │    Badge     │<────┘
                        ├──────────────┤
                        │ id           │
                        │ name         │
                        │ description  │
                        │ icon_url     │
                        │ rarity       │
                        │ criteria     │
                        └──────────────┘

┌─────────────┐         ┌──────────────┐
│    User     │────────<│ UserChallenge│>────┐
└─────────────┘         ├──────────────┤     │
                        │ id           │     │
                        │ user_id (FK) │     │
                        │ challenge_id │     │
                        │ progress     │     │
                        │ completed_at │     │
                        └──────────────┘     │
                                             │
                        ┌──────────────┐     │
                        │  Challenge   │<────┘
                        ├──────────────┤
                        │ id           │
                        │ title        │
                        │ description  │
                        │ type         │
                        │ target       │
                        │ reward_xp    │
                        │ start_date   │
                        │ end_date     │
                        └──────────────┘

┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│    User     │────────<│   Route      │>───────<│  RoutePoint │
└─────────────┘         ├──────────────┤         ├─────────────┤
                        │ id           │         │ id          │
                        │ user_id (FK) │         │ route_id    │
                        │ name         │         │ place_id    │
                        │ created_at   │         │ order       │
                        │ transport    │         │ duration    │
                        └──────────────┘         │ distance    │
                                                 └─────────────┘

┌─────────────┐         ┌──────────────┐
│    User     │────────<│  Friendship  │>────┐
│             │         ├──────────────┤     │
│             │         │ id           │     │
│             │         │ user1_id (FK)│     │
│             │<────────│ user2_id (FK)│─────┘
└─────────────┘         │ status       │
                        │ created_at   │
                        └──────────────┘

┌─────────────┐         ┌──────────────┐
│   Place     │────────<│   Benefit    │
│             │         ├──────────────┤
│             │         │ id           │
│             │         │ place_id (FK)│
│             │         │ type         │
│             │         │ description  │
│             │         │ discount_pct │
│             │         │ valid_until  │
│             │         │ max_uses     │
│             │         │ current_uses │
│             │         └──────────────┘
│             │                │
│             │                │
│             │         ┌──────▼───────┐
└─────────────┘         │ BenefitUse   │
      │                 ├──────────────┤
      │                 │ id           │
      └────────────────<│ benefit_id   │
                        │ user_id (FK) │
                        │ code         │
                        │ used_at      │
                        │ validated    │
                        └──────────────┘

┌─────────────┐         ┌──────────────┐
│    User     │────────<│   Reward     │>────┐
└─────────────┘         ├──────────────┤     │
                        │ id           │     │
                        │ user_id (FK) │     │
                        │ reward_id    │     │
                        │ redeemed_at  │     │
                        │ voucher_code │     │
                        │ used_at      │     │
                        └──────────────┘     │
                                             │
                        ┌──────────────┐     │
                        │ RewardCatalog│<────┘
                        ├──────────────┤
                        │ id           │
                        │ name         │
                        │ description  │
                        │ cost_points  │
                        │ category     │
                        │ partner_id   │
                        │ valid_days   │
                        └──────────────┘
```

### 7.2 Tabelas Principais

#### Tabela: users
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    oauth_provider VARCHAR(50), -- google, apple, facebook
    oauth_id VARCHAR(255),
    name VARCHAR(100) NOT NULL,
    avatar_url TEXT,
    bio TEXT,
    xp INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    coins INTEGER DEFAULT 0, -- moeda virtual para recompensas
    preferences JSONB, -- {interests: [], budget: '', transport: ''}
    privacy_settings JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    CONSTRAINT valid_xp CHECK (xp >= 0),
    CONSTRAINT valid_level CHECK (level >= 1)
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_xp ON users(xp DESC);
```

#### Tabela: places
```sql
CREATE TABLE places (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL, -- restaurant, museum, park, attraction, etc.
    subcategory VARCHAR(50),
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(50) NOT NULL,
    country VARCHAR(50) DEFAULT 'Brazil',
    postal_code VARCHAR(20),
    phone VARCHAR(20),
    website TEXT,
    price_level INTEGER, -- 1-4 ($ to $$$$)
    rating_avg DECIMAL(3, 2), -- 0.00 to 5.00
    rating_count INTEGER DEFAULT 0,
    photos JSONB, -- [{url: '', caption: ''}]
    hours JSONB, -- {monday: {open: '09:00', close: '18:00'}, ...}
    average_visit_duration INTEGER, -- em minutos
    tags TEXT[], -- ['family-friendly', 'pet-friendly', 'romantic']
    is_partner BOOLEAN DEFAULT FALSE,
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    safety_level VARCHAR(20), -- safe, caution, avoid
    accessibility_info JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_rating CHECK (rating_avg >= 0 AND rating_avg <= 5),
    CONSTRAINT valid_price CHECK (price_level >= 1 AND price_level <= 4)
);

CREATE INDEX idx_places_category ON places(category);
CREATE INDEX idx_places_city ON places(city);
CREATE INDEX idx_places_location ON places USING GIST (
    ll_to_earth(latitude, longitude)
);
CREATE INDEX idx_places_rating ON places(rating_avg DESC);
CREATE INDEX idx_places_partner ON places(is_partner) WHERE is_partner = TRUE;
```

#### Tabela: reviews
```sql
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    place_id UUID NOT NULL REFERENCES places(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    photos TEXT[], -- URLs das fotos
    tags TEXT[], -- ['clean', 'good-food', 'friendly-staff']
    helpful_count INTEGER DEFAULT 0,
    visit_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_verified BOOLEAN DEFAULT FALSE, -- verificado via check-in
    is_active BOOLEAN DEFAULT TRUE,
    UNIQUE(user_id, place_id) -- um usuário só pode avaliar um lugar uma vez
);

CREATE INDEX idx_reviews_place ON reviews(place_id, created_at DESC);
CREATE INDEX idx_reviews_user ON reviews(user_id, created_at DESC);
CREATE INDEX idx_reviews_rating ON reviews(rating DESC);
```

#### Tabela: checkins
```sql
CREATE TABLE checkins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    place_id UUID NOT NULL REFERENCES places(id) ON DELETE CASCADE,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    photo_url TEXT,
    comment TEXT,
    xp_earned INTEGER DEFAULT 10,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_checkins_user ON checkins(user_id, created_at DESC);
CREATE INDEX idx_checkins_place ON checkins(place_id, created_at DESC);
```

#### Tabela: badges
```sql
CREATE TABLE badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon_url TEXT,
    category VARCHAR(50), -- exploration, gastronomy, culture, social
    rarity VARCHAR(20), -- common, rare, epic, legendary
    criteria JSONB, -- {type: 'checkin_count', value: 10, category: 'museum'}
    xp_reward INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    badge_id UUID NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
    earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, badge_id)
);

CREATE INDEX idx_user_badges_user ON user_badges(user_id, earned_at DESC);
```

#### Tabela: challenges
```sql
CREATE TABLE challenges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(20) NOT NULL, -- daily, weekly, special
    category VARCHAR(50),
    target_value INTEGER NOT NULL, -- valor alvo (ex: 5 check-ins)
    target_type VARCHAR(50), -- checkin, review, visit_category, etc.
    reward_xp INTEGER NOT NULL,
    reward_coins INTEGER DEFAULT 0,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_challenges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    challenge_id UUID NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
    current_progress INTEGER DEFAULT 0,
    is_completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, challenge_id)
);

CREATE INDEX idx_user_challenges_user ON user_challenges(user_id, is_completed);
CREATE INDEX idx_challenges_active ON challenges(is_active, end_date);
```

#### Tabela: routes
```sql
CREATE TABLE routes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255),
    transport_mode VARCHAR(20), -- walking, public, rideshare
    total_distance INTEGER, -- em metros
    total_duration INTEGER, -- em minutos
    is_favorite BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE route_points (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    route_id UUID NOT NULL REFERENCES routes(id) ON DELETE CASCADE,
    place_id UUID NOT NULL REFERENCES places(id) ON DELETE CASCADE,
    order_index INTEGER NOT NULL,
    duration_to_next INTEGER, -- minutos até próximo ponto
    distance_to_next INTEGER, -- metros até próximo ponto
    UNIQUE(route_id, order_index)
);

CREATE INDEX idx_routes_user ON routes(user_id, created_at DESC);
CREATE INDEX idx_route_points_route ON route_points(route_id, order_index);
```

#### Tabela: friendships
```sql
CREATE TABLE friendships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user1_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    user2_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'pending', -- pending, accepted, blocked
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    accepted_at TIMESTAMP,
    CHECK (user1_id < user2_id), -- garante ordem e evita duplicatas
    UNIQUE(user1_id, user2_id)
);

CREATE INDEX idx_friendships_user1 ON friendships(user1_id, status);
CREATE INDEX idx_friendships_user2 ON friendships(user2_id, status);
```

#### Tabela: benefits
```sql
CREATE TABLE benefits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    place_id UUID NOT NULL REFERENCES places(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(50), -- discount, freebie, upgrade
    discount_percentage INTEGER,
    discount_amount DECIMAL(10, 2),
    valid_from TIMESTAMP,
    valid_until TIMESTAMP,
    max_uses INTEGER,
    current_uses INTEGER DEFAULT 0,
    terms TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE benefit_uses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    benefit_id UUID NOT NULL REFERENCES benefits(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    code VARCHAR(100) UNIQUE NOT NULL, -- QR code único
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    used_at TIMESTAMP,
    validated_by UUID, -- ID do funcionário que validou
    is_valid BOOLEAN DEFAULT TRUE
);

CREATE INDEX idx_benefits_place ON benefits(place_id, is_active);
CREATE INDEX idx_benefit_uses_code ON benefit_uses(code);
CREATE INDEX idx_benefit_uses_user ON benefit_uses(user_id, generated_at DESC);
```

#### Tabela: rewards
```sql
CREATE TABLE reward_catalog (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    cost_points INTEGER NOT NULL,
    category VARCHAR(50), -- discount, experience, product, upgrade
    partner_id UUID REFERENCES places(id),
    image_url TEXT,
    valid_days INTEGER, -- dias de validade após resgate
    stock_quantity INTEGER,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_rewards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    reward_id UUID NOT NULL REFERENCES reward_catalog(id) ON DELETE CASCADE,
    voucher_code VARCHAR(100) UNIQUE,
    redeemed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP,
    used_at TIMESTAMP,
    is_valid BOOLEAN DEFAULT TRUE
);

CREATE INDEX idx_reward_catalog_active ON reward_catalog(is_active, cost_points);
CREATE INDEX idx_user_rewards_user ON user_rewards(user_id, redeemed_at DESC);
```

#### Tabela: notifications
```sql
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- badge_earned, level_up, challenge_complete, friend_request
    title VARCHAR(255) NOT NULL,
    body TEXT,
    data JSONB, -- dados adicionais específicos do tipo
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notifications_user ON notifications(user_id, is_read, created_at DESC);
```

### 7.3 Relacionamentos Redis (Cache)

```
-- Sessões de usuário
session:{token} -> {user_id, expiry, device_info}

-- Rankings (atualizados semanalmente)
ranking:global:xp -> ZSET (user_id, xp)
ranking:city:{city_id}:xp -> ZSET (user_id, xp)
ranking:challenges -> ZSET (user_id, challenges_completed)

-- Cache de recomendações
recommendations:{user_id} -> JSON [place_ids com scores]
TTL: 30 minutos

-- Rate limiting
rate_limit:{user_id}:{endpoint} -> contador
TTL: 1 minuto

-- Localização temporária (para navegação)
location:{user_id} -> {lat, lng, timestamp}
TTL: 5 minutos
```

---

## 8. Fluxos de Usuário Detalhados

### 8.1 Fluxo: Primeiro Acesso (Onboarding)

```
┌─────────────────────────────────────────────────────────────┐
│                    SPLASH SCREEN                            │
│              (Logo + Loading 2s)                            │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                 WELCOME SCREEN                              │
│  - Título: "Explore como nunca antes!"                      │
│  - Subtítulo: "Turismo gamificado, recompensas reais"      │
│  - Botão: "Começar"                                         │
│  - Link: "Já tenho conta"                                   │
└────────────────────┬────────────────────────────────────────┘
                     │ Clica "Começar"
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              REGISTRATION SCREEN                            │
│  - Opções:                                                  │
│    • Email + Senha                                          │
│    • Continuar com Google                                   │
│    • Continuar com Apple                                    │
│    • Continuar com Facebook                                 │
│  - Checkbox: Aceito Termos de Uso                           │
│  - Link: Política de Privacidade                            │
└────────────────────┬────────────────────────────────────────┘
                     │ Completa cadastro
                     ▼
┌─────────────────────────────────────────────────────────────┐
│          PREFERENCES QUESTIONNAIRE (1/3)                    │
│  Pergunta: "Que tipo de experiências você prefere?"         │
│  - Cards com ícones:                                        │
│    □ Cultura    □ Natureza    □ Gastronomia               │
│    □ Aventura   □ Compras     □ Vida Noturna              │
│  - Permite múltipla seleção                                 │
│  - Botão: "Próximo"                                         │
│  - Link: "Pular por agora"                                  │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│          PREFERENCES QUESTIONNAIRE (2/3)                    │
│  Pergunta: "Qual seu orçamento típico por dia?"             │
│  - Cards com valores:                                       │
│    ○ Econômico (até R$100)                                  │
│    ○ Moderado (R$100-300)                                   │
│    ○ Confortável (R$300-600)                                │
│    ○ Premium (R$600+)                                       │
│  - Botão: "Próximo"                                         │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│          PREFERENCES QUESTIONNAIRE (3/3)                    │
│  Pergunta: "Como prefere se locomover?"                     │
│  - Cards com ícones:                                        │
│    ○ A pé (adoro caminhar)                                  │
│    ○ Transporte público                                     │
│    ○ Uber/Táxi                                              │
│    ○ Carro próprio                                          │
│  - Botão: "Concluir"                                        │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              PROFILE SUMMARY                                │
│  "Seu perfil está pronto!"                                  │
│  - Ícones visuais do perfil criado                          │
│  - Prévia: "Exploradora Cultural, Orçamento Moderado"       │
│  - Botão: "Começar a Explorar"                              │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│            PERMISSION REQUESTS                              │
│  1. "Permitir localização?"                                 │
│     - Necessário para recomendações próximas                │
│     - Botões: "Permitir" / "Agora não"                      │
│                                                             │
│  2. "Permitir notificações?"                                │
│     - Receba alertas de desafios e recompensas              │
│     - Botões: "Permitir" / "Agora não"                      │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│               QUICK TUTORIAL                                │
│  Overlay interativo sobre tela principal:                   │
│  1. "Aqui estão suas recomendações personalizadas"          │
│  2. "Toque para ver detalhes"                               │
│  3. "Crie rotas otimizadas"                                 │
│  4. "Complete desafios e ganhe XP"                          │
│  - Botão: "Entendi" / "Próximo"                             │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│               HOME SCREEN                                   │
│  (Feed de recomendações personalizadas)                     │
└─────────────────────────────────────────────────────────────┘
```

**Tempo estimado:** 3-5 minutos  
**Dropoff crítico:** Questionnaire (implementar skip simples)

---

### 8.2 Fluxo: Descobrir e Visitar Atração

```
HOME SCREEN
    │
    │ Usuário vê card de atração interessante
    │ (ex: "Mercado Municipal - 1.2km")
    │
    ▼
┌─────────────────────────────────────────────────────────────┐
│            PLACE DETAILS SCREEN                             │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  [Galeria de Fotos] <- Swipe horizontal            │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                             │
│  Mercado Municipal ★★★★☆ 4.5                               │
│  Gastronomia • Cultura                                      │
│  🚶 1.2 km • 15 min a pé                                    │
│  💰 $$ • Preço Moderado                                     │
│  ✅ Parceiro Oficial                                        │
│                                                             │
│  📍 R. da Cantareira, 306 - Centro, São Paulo               │
│  🕐 Segunda a Sábado: 6h - 18h • Domingo: 6h - 16h          │
│  ⏱️ Tempo médio de visita: 2 horas                          │
│                                                             │
│  [Descrição completa expandível...]                         │
│                                                             │
│  🏷️ Tags: Histórico • Família-Friendly • Foto-Friendly     │
│                                                             │
│  💎 Benefício Exclusivo                                     │
│  10% de desconto em qualquer barraca                        │
│                                                             │
│  ─────────────────────────────────────────────────────────  │
│                                                             │
│  ⭐ Avaliações (1.234)                                      │
│  [Preview de 3 reviews mais úteis]                          │
│  [Botão: Ver todas avaliações]                              │
│                                                             │
│  ─────────────────────────────────────────────────────────  │
│                                                             │
│  💡 Dicas da Comunidade                                     │
│  • "Chegue cedo para evitar filas"                          │
│  • "Experimente o pastel de bacalhau"                       │
│  [Adicionar dica]                                           │
│                                                             │
│  ─────────────────────────────────────────────────────────  │
│                                                             │
│  🗺️ Localização e Rotas                                     │
│  [Mapa miniatura]                                           │
│                                                             │
│  Como chegar:                                               │
│  🚶 A pé: 15 min (1.2 km)                                   │
│  🚌 Ônibus: 8 min - Linha 4011 (R$ 4,40)                    │
│  🚗 Uber: 6 min (R$ 8-12)                                   │
│                                                             │
│  ─────────────────────────────────────────────────────────  │
│                                                             │
│  [Botão Principal: 🧭 Ir para lá]                           │
│  [Botão Secundário: ➕ Adicionar à rota]                    │
│  [Botão: ❤️ Salvar] [Botão: 📤 Compartilhar]                │
└─────────────────────────────────────────────────────────────┘
    │
    │ Usuário clica "Ir para lá"
    │
    ▼
┌─────────────────────────────────────────────────────────────┐
│         TRANSPORT MODE SELECTION                            │
│  "Como você quer ir?"                                       │
│                                                             │
│  ┌────────────────────┐ ┌────────────────────┐             │
│  │   🚶 A pé          │ │  🚌 Transporte     │             │
│  │   15 min           │ │     Público        │             │
│  │   1.2 km           │ │   8 min + espera   │             │
│  │                    │ │   R$ 4,40          │             │
│  └────────────────────┘ └────────────────────┘             │
│                                                             │
│  ┌────────────────────┐                                     │
│  │   🚗 Uber/99       │                                     │
│  │   6 min            │                                     │
│  │   R$ 8-12          │                                     │
│  └────────────────────┘                                     │
│                                                             │
│  [Botão: Confirmar]                                         │
└─────────────────────────────────────────────────────────────┘
    │
    │ Usuário seleciona "A pé" e confirma
    │
    ▼
┌─────────────────────────────────────────────────────────────┐
│            NAVIGATION SCREEN                                │
│  ┌─────────────────────────────────────────────────────┐    │
│  │        [MAPA COM ROTA TRAÇADA]                      │    │
│  │                                                     │    │
│  │   📍 Você está aqui                                 │    │
│  │   ----rota azul---->                                │    │
│  │                    🏛️ Mercado Municipal             │    │
│  │                                                     │    │
│  │  [Botão: Recentralizar 🎯]                          │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                             │
│  ⬆️ Em 50m, vire à direita na R. Florêncio de Abreu        │
│                                                             │
│  ⏱️ 13 min restantes • 🚶 1.0 km                            │
│                                                             │
│  [Botão: 🔊 Ativar narração]                                │
│  [Botão: ❌ Cancelar navegação]                             │
└─────────────────────────────────────────────────────────────┘
    │
    │ Usuário chega ao destino (geofencing detecta)
    │
    ▼
┌─────────────────────────────────────────────────────────────┐
│            ARRIVAL NOTIFICATION                             │
│  🎉 Você chegou ao Mercado Municipal!                       │
│                                                             │
│  [Botão: ✅ Fazer Check-in (+10 XP)]                        │
│  [Botão: 🎁 Usar Benefício]                                 │
│  [Botão: Agora não]                                         │
└─────────────────────────────────────────────────────────────┘
    │
    │ Usuário clica "Fazer Check-in"
    │
    ▼
┌─────────────────────────────────────────────────────────────┐
│            CHECK-IN SCREEN                                  │
│  Check-in no Mercado Municipal                              │
│                                                             │
│  📸 [Adicionar foto (opcional)]                             │
│  💬 [Adicione um comentário (opcional)]                     │
│      "Ex: Lugar incrível, pastel delicioso!"                │
│                                                             │
│  [Botão: ✅ Confirmar Check-in]                             │
└─────────────────────────────────────────────────────────────┘
    │
    │ Check-in confirmado
    │
    ▼
┌─────────────────────────────────────────────────────────────┐
│         CHECK-IN SUCCESS + REWARDS                          │
│  ✅ Check-in realizado com sucesso!                         │
│                                                             │
│  🎊 Você ganhou:                                            │
│  • +10 XP                                                   │
│  • Progresso no desafio "Explorador Matinal" (1/3)         │
│                                                             │
│  🏆 Nova conquista desbloqueada!                            │
│  [Badge: "Primeira Visita"]                                 │
│                                                             │
│  [Botão: Ver Perfil]                                        │
│  [Botão: Continuar Explorando]                              │
│                                                             │
│  ─────────────────────────────────────────────────────────  │
│  💬 Gostou do lugar? Avalie agora e ganhe +25 XP!           │
│  [Botão: Avaliar Agora]                                     │
└─────────────────────────────────────────────────────────────┘
```

---

### 8.3 Fluxo: Usar Benefício de Parceiro

```
PLACE DETAILS SCREEN
    │
    │ Usuário vê "💎 Benefício Exclusivo: 10% desconto"
    │
    ▼
┌─────────────────────────────────────────────────────────────┐
│            BENEFIT DETAILS                                  │
│  💎 Benefício Exclusivo                                     │
│                                                             │
│  10% de desconto em qualquer compra                         │
│                                                             │
│  📝 Termos:                                                 │
│  • Válido de segunda a sexta                                │
│  • Não cumulativo com outras promoções                      │
│  • Válido até 31/12/2026                                    │
│                                                             │
│  ✅ 234 pessoas já usaram este benefício                    │
│                                                             │
│  [Botão: 🎁 Usar Benefício Agora]                           │
└─────────────────────────────────────────────────────────────┘
    │
    │ Usuário clica "Usar Benefício"
    │
    ▼
┌─────────────────────────────────────────────────────────────┐
│         BENEFIT ACTIVATION - LOCATION CHECK                 │
│  Verificando sua localização...                             │
│                                                             │
│  ⚠️ Você precisa estar no estabelecimento                   │
│     para usar este benefício.                               │
│                                                             │
│  Distância atual: 850m                                      │
│                                                             │
│  [Botão: 🧭 Ir para lá]                                     │
│  [Botão: Cancelar]                                          │
└─────────────────────────────────────────────────────────────┘
    │
    │ Usuário se aproxima e está dentro do raio (100m)
    │ App detecta automaticamente
    │
    ▼
┌─────────────────────────────────────────────────────────────┐
│         BENEFIT ACTIVATION - READY                          │
│  ✅ Você está no local!                                     │
│                                                             │
│  Gere seu código agora para usar o benefício.               │
│                                                             │
│  ⏰ O código será válido por 15 minutos                     │
│                                                             │
│  [Botão: 🎁 Gerar Código]                                   │
│  [Botão: Cancelar]                                          │
└─────────────────────────────────────────────────────────────┘
    │
    │ Usuário clica "Gerar Código"
    │
    ▼
┌─────────────────────────────────────────────────────────────┐
│         BENEFIT CODE - QR DISPLAY                           │
│  🎉 Seu código está pronto!                                 │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                                                     │    │
│  │          [QR CODE GRANDE]                           │    │
│  │                                                     │    │
│  │        Código: MKT-2026-ABCD                        │    │
│  │                                                     │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                             │
│  📱 Mostre este código no caixa                             │
│                                                             │
│  ⏰ Válido por 15:00 minutos                                │
│  [Countdown timer animado]                                  │
│                                                             │
│  💡 Como usar:                                              │
│  1. Mostre este código ao atendente                         │
│  2. Aguarde a validação                                     │
│  3. Aproveite seu desconto!                                 │
│                                                             │
│  [Botão: Cancelar Código]                                   │
└─────────────────────────────────────────────────────────────┘
    │
    │ Estabelecimento escaneia QR ou digita código
    │ Sistema valida e marca como usado
    │
    ▼
┌─────────────────────────────────────────────────────────────┐
│         BENEFIT USED - SUCCESS                              │
│  ✅ Benefício utilizado com sucesso!                        │
│                                                             │
│  Você economizou aproximadamente R$ 15,00                   │
│                                                             │
│  🎊 Você ganhou:                                            │
│  • +30 XP (Bônus por usar benefício)                        │
│  • Progresso no desafio "Cliente VIP" (1/5)                 │
│                                                             │
│  ─────────────────────────────────────────────────────────  │
│  💬 Como foi sua experiência?                               │
│  Avalie agora e ajude outros viajantes!                     │
│                                                             │
│  [Botão: ⭐ Avaliar Agora (+25 XP)]                         │
│  [Botão: Agora não]                                         │
└─────────────────────────────────────────────────────────────┘
```

---

### 8.4 Fluxo: Completar Desafio e Ganhar Badge

```
HOME SCREEN
    │
    │ Usuário vê notificação: "Novo desafio diário disponível!"
    │
    ▼
┌─────────────────────────────────────────────────────────────┐
│            CHALLENGES SCREEN                                │
│                                                             │
│  🏆 Seus Desafios                                           │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ 🌅 Desafio Diário                                   │    │
│  │ Explorador Matinal                                  │    │
│  │ Faça 3 check-ins antes das 12h                      │    │
│  │                                                     │    │
│  │ Progresso: ████░░░░░░░ 1/3                         │    │
│  │ Recompensa: +50 XP                                  │    │
│  │ Expira em: 8h 45min                                 │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ 📅 Desafio Semanal                                  │    │
│  │ Aventura Gastronômica                               │    │
│  │ Experimente 5 tipos de culinária diferentes         │    │
│  │                                                     │    │
│  │ Progresso: ██████░░░░ 3/5                          │    │
│  │ ✅ Brasileira  ✅ Italiana  ✅ Japonesa             │    │
│  │ ⬜ Indiana  ⬜ Mexicana                              │    │
│  │                                                     │    │
│  │ Recompensa: +150 XP + Badge "Gourmet"               │    │
│  │ Expira em: 4 dias                                   │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ ⭐ Desafio Especial                                 │    │
│  │ Rota do Café                                        │    │
│  │ Visite 10 cafeterias especiais da cidade            │    │
│  │                                                     │    │
│  │ Progresso: ██████████ 10/10 ✅ COMPLETO!           │    │
│  │                                                     │    │
│  │ [Botão: 🎁 Resgatar Recompensa]                     │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
    │
    │ Usuário completa o terceiro check-in matinal
    │ Sistema detecta conclusão do desafio
    │
    ▼
┌─────────────────────────────────────────────────────────────┐
│         CHALLENGE COMPLETED - ANIMATION                     │
│                                                             │
│  [Animação: Confetes caindo]                                │
│                                                             │
│  🎉 DESAFIO COMPLETO! 🎉                                    │
│                                                             │
│  Explorador Matinal                                         │
│                                                             │
│  Você completou o desafio:                                  │
│  "Faça 3 check-ins antes das 12h"                           │
│                                                             │
│  [Animação: Moedas de XP voando para o perfil]              │
│                                                             │
│  +50 XP                                                     │
│                                                             │
│  [Botão: Continuar]                                         │
└─────────────────────────────────────────────────────────────┘
    │
    │ Ao mesmo tempo, sistema verifica se conquistou badge
    │ "Madrugador" (complete 10 desafios matinais)
    │ Era o 10º desafio matinal → Badge desbloqueado!
    │
    ▼
┌─────────────────────────────────────────────────────────────┐
│         NEW BADGE UNLOCKED - ANIMATION                      │
│                                                             │
│  [Animação: Badge girando e brilhando]                      │
│                                                             │
│  🏅 NOVA CONQUISTA DESBLOQUEADA! 🏅                         │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                                                     │    │
│  │          [ÍCONE DO BADGE]                           │    │
│  │         🌄 Madrugador                               │    │
│  │                                                     │    │
│  │  "Complete 10 desafios antes do meio-dia"           │    │
│  │                                                     │    │
│  │  Raridade: ⭐⭐⭐ Raro                                │    │
│  │                                                     │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                             │
│  +100 XP Bônus                                              │
│                                                             │
│  [Botão: 📤 Compartilhar]                                   │
│  [Botão: Ver Coleção de Badges]                             │
│  [Botão: Continuar]                                         │
└─────────────────────────────────────────────────────────────┘
    │
    │ Sistema verifica nível
    │ XP total passou de 2000 → Subiu de Prata para Ouro!
    │
    ▼
┌─────────────────────────────────────────────────────────────┐
│         LEVEL UP - ANIMATION                                │
│                                                             │
│  [Animação: Estrelas e raios dourados]                      │
│                                                             │
│  ⬆️ VOCÊ SUBIU DE NÍVEL! ⬆️                                │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                                                     │    │
│  │    🥈 Nível Prata  →  🥇 Nível Ouro                │    │
│  │                                                     │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                             │
│  Você desbloqueou:                                          │
│  • Acesso a desafios exclusivos Ouro                        │
│  • 15% de desconto em recompensas                           │
│  • Badge dourado no perfil                                  │
│                                                             │
│  [Botão: 📤 Compartilhar]                                   │
│  [Botão: Ver Novidades]                                     │
│  [Botão: Continuar]                                         │
└─────────────────────────────────────────────────────────────┘
    │
    │ Retorna ao feed
    │
    ▼
HOME SCREEN
(Badge dourado agora visível no canto do perfil)
```

---

## 9. Wireframes e Mockups de Telas

### 9.1 Tela Principal (Home)

```
┌──────────────────────────────────────────┐
│ [☰]    TurismoApp          [🔔] [👤]     │ <- Header
├──────────────────────────────────────────┤
│                                          │
│ 📍 São Paulo, SP              [Filtros]  │ <- Localização
│                                          │
│ ─────────────────────────────────────────│
│                                          │
│ 🎯 Desafio do Dia                        │ <- Card Desafio
│ "Explorador Matinal"                     │
│ ████░░░░░░░ 1/3                          │
│ +50 XP  ⏰ Expira em 8h                   │
│                                          │
│ ─────────────────────────────────────────│
│                                          │
│ ⭐ Recomendações para Você               │ <- Título Seção
│                                          │
│ ┌──────────────────────────────────────┐ │
│ │ [Foto]                               │ │
│ │ Mercado Municipal                    │ │
│ │ ★★★★☆ 4.5 • Gastronomia             │ │ <- Card Lugar
│ │ 🚶 1.2km • 15min • $$ • ✅ Parceiro  │ │
│ │ 💎 10% desconto                      │ │
│ └──────────────────────────────────────┘ │
│                                          │
│ ┌──────────────────────────────────────┐ │
│ │ [Foto]                               │ │
│ │ Museu de Arte                        │ │
│ │ ★★★★★ 4.8 • Cultura                 │ │
│ │ 🚌 2.5km • 10min • $$                │ │
│ └──────────────────────────────────────┘ │
│                                          │
│ [Carregar mais...]                       │
│                                          │
│ ─────────────────────────────────────────│
│ [🏠]  [🗺️]  [🏆]  [💰]  [👤]             │ <- Bottom Nav
│ Home Rotas Desafios Rewards Perfil      │
└──────────────────────────────────────────┘
```

### 9.2 Tela de Detalhes do Lugar

```
┌──────────────────────────────────────────┐
│ [←]                           [❤️] [📤]  │ <- Header
├──────────────────────────────────────────┤
│ [=== Galeria de Fotos (Swipe) ===]       │
│   ← Foto Principal, 5 fotos total →      │
├──────────────────────────────────────────┤
│                                          │
│ Mercado Municipal                        │ <- Título
│ ★★★★☆ 4.5 (1.234 avaliações)            │
│                                          │
│ 🏷️ Gastronomia • Cultura                 │
│ 🚶 1.2 km • 15 min a pé                  │
│ 💰 $$ • Preço Moderado                   │
│ ✅ Parceiro Oficial                      │
│                                          │
│ ─────────────────────────────────────────│
│                                          │
│ 📍 R. da Cantareira, 306 - Centro        │
│ 🕐 Seg-Sáb: 6h-18h • Dom: 6h-16h         │
│ ⏱️ Tempo médio: 2 horas                  │
│                                          │
│ [Ver no mapa]                            │
│                                          │
│ ─────────────────────────────────────────│
│                                          │
│ 📝 Sobre                                 │
│ Mercado histórico de 1933 com           │
│ arquitetura art déco. Famoso por         │
│ produtos frescos e culinária típica...   │
│ [Ler mais]                               │
│                                          │
│ 🏷️ Histórico • Família • Foto-Friendly  │
│                                          │
│ ─────────────────────────────────────────│
│                                          │
│ 💎 Benefício Exclusivo                   │
│ ┌────────────────────────────────────┐   │
│ │ 10% de desconto em qualquer compra │   │
│ │ [Usar Benefício]                   │   │
│ └────────────────────────────────────┘   │
│                                          │
│ ─────────────────────────────────────────│
│                                          │
│ 🚶 Como chegar                           │
│ A pé: 15 min (1.2 km)                    │
│ 🚌 Ônibus: 8 min - Linha 4011 (R$ 4,40) │
│ 🚗 Uber: 6 min (R$ 8-12)                 │
│                                          │
│ ─────────────────────────────────────────│
│                                          │
│ ⭐ Avaliações (1.234)                    │
│                                          │
│ ┌────────────────────────────────────┐   │
│ │ Marina S. ★★★★★                    │   │
│ │ "Lugar incrível! O pastel de       │   │
│ │  bacalhau é imperdível."            │   │
│ │ 👍 124 pessoas acharam útil         │   │
│ └────────────────────────────────────┘   │
│                                          │
│ [Ver todas avaliações]                   │
│                                          │
│ ─────────────────────────────────────────│
│                                          │
│ [🧭 Ir para lá]  [➕ Adicionar à rota]   │ <- Ações
│                                          │
└──────────────────────────────────────────┘
```

### 9.3 Tela de Navegação

```
┌──────────────────────────────────────────┐
│ [←] Navegação                   [⋮]      │
├──────────────────────────────────────────┤
│                                          │
│ ╔══════════════════════════════════════╗ │
│ ║                                      ║ │
│ ║     [MAPA INTERATIVO]                ║ │
│ ║                                      ║ │
│ ║  📍 Você está aqui                   ║ │
│ ║   │                                  ║ │
│ ║   │ Rota azul                        ║ │
│ ║   ↓                                  ║ │
│ ║                                      ║ │
│ ║   🏛️ Mercado Municipal               ║ │
│ ║                                      ║ │
│ ║                        [🎯 Recentrar]║ │
│ ╚══════════════════════════════════════╝ │
│                                          │
│ ┌────────────────────────────────────┐   │
│ │ ⬆️ Em 50m, vire à direita           │   │ <- Próxima Ação
│ │ na R. Florêncio de Abreu           │   │
│ └────────────────────────────────────┘   │
│                                          │
│ ⏱️ 13 min restantes • 🚶 1.0 km          │
│                                          │
│ ─────────────────────────────────────────│
│                                          │
│ [🔊 Narração]  [❌ Cancelar navegação]   │
│                                          │
└──────────────────────────────────────────┘
```

### 9.4 Tela de Desafios

```
┌──────────────────────────────────────────┐
│ [←] Desafios                   [ℹ️]      │
├──────────────────────────────────────────┤
│                                          │
│ 🏆 Seus Desafios                         │
│                                          │
│ [Diários] [Semanais] [Especiais]         │ <- Tabs
│ ─────────                                │
│                                          │
│ ┌────────────────────────────────────┐   │
│ │ 🌅 Explorador Matinal              │   │
│ │ Faça 3 check-ins antes das 12h     │   │
│ │                                    │   │
│ │ ████░░░░░░░ 1/3                    │   │
│ │                                    │   │
│ │ 💎 Recompensa: +50 XP              │   │
│ │ ⏰ Expira em 8h 45min               │   │
│ └────────────────────────────────────┘   │
│                                          │
│ ┌────────────────────────────────────┐   │
│ │ 🍽️ Crítico Gourmet                 │   │
│ │ Avalie um restaurante que visitou  │   │
│ │                                    │   │
│ │ ░░░░░░░░░░ 0/1                     │   │
│ │                                    │   │
│ │ 💎 Recompensa: +25 XP              │   │
│ │ ⏰ Expira em 11h 20min              │   │
│ └────────────────────────────────────┘   │
│                                          │
│ ┌────────────────────────────────────┐   │
│ │ 📸 Fotógrafo da Vez                │   │
│ │ Adicione 3 fotos a lugares         │   │
│ │ diferentes                          │   │
│ │                                    │   │
│ │ ██████░░░░ 2/3                     │   │
│ │                                    │   │
│ │ 💎 Recompensa: +30 XP              │   │
│ │ ⏰ Expira em 7h 10min               │   │
│ └────────────────────────────────────┘   │
│                                          │
│ ─────────────────────────────────────────│
│                                          │
│ 📊 Estatísticas                          │
│ Desafios completados hoje: 2             │
│ Desafios completados esta semana: 8      │
│ Sequência atual: 5 dias 🔥              │
│                                          │
└──────────────────────────────────────────┘
```

### 9.5 Tela de Perfil

```
┌──────────────────────────────────────────┐
│ [←] Perfil                      [⚙️]     │
├──────────────────────────────────────────┤
│                                          │
│        ┌─────────┐                       │
│        │ [Foto]  │  Marina Silva         │
│        │ Avatar  │  @marinaexplora       │
│        └─────────┘                       │
│                                          │
│        🥇 Nível Ouro                     │
│        ████████░░ 4.235 / 5.000 XP       │
│                                          │
│ [Editar Perfil]  [Compartilhar]          │
│                                          │
│ ─────────────────────────────────────────│
│                                          │
│ 📊 Estatísticas                          │
│                                          │
│  48        127         32       15       │
│ Check-ins  Lugares   Desafios  Badges    │
│                    Completos             │
│                                          │
│ ─────────────────────────────────────────│
│                                          │
│ 🏅 Badges em Destaque                    │
│                                          │
│ [🌄] [🍽️] [🗺️] [⭐] [🎯]                 │
│ Madru  Gourmet  Explo- Primei- Master   │
│ gador          rador   ra      Explora   │
│                       Visita   dor       │
│                                          │
│ [Ver todos os 15 badges]                 │
│                                          │
│ ─────────────────────────────────────────│
│                                          │
│ 🏆 Rankings                              │
│                                          │
│ 🌍 Global: #3.457                        │
│ 📍 São Paulo: #89                        │
│ 👥 Entre Amigos: #2                      │
│                                          │
│ ─────────────────────────────────────────│
│                                          │
│ 📍 Lugares Visitados                     │
│                                          │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│ │ [Foto]   │ │ [Foto]   │ │ [Foto]   │  │
│ │ Mercado  │ │ Museu    │ │ Parque   │  │
│ │ Muni...  │ │ Arte     │ │ Ibirap...|  │
│ └──────────┘ └──────────┘ └──────────┘  │
│                                          │
│ [Ver todos os 127 lugares]               │
│                                          │
│ ─────────────────────────────────────────│
│                                          │
│ 👥 Amigos (24)                           │
│                                          │
│ [Avatar] [Avatar] [Avatar] [+21]         │
│                                          │
│ ─────────────────────────────────────────│
│                                          │
│ • Minhas Avaliações (32)                 │
│ • Lugares Salvos (18)                    │
│ • Rotas Favoritas (5)                    │
│ • Recompensas Resgatadas                 │
│                                          │
└──────────────────────────────────────────┘
```

---

## 10. Roadmap de Desenvolvimento

### Fase 1: MVP (3 meses)
**Objetivo:** Lançar produto mínimo viável funcional

**Sprint 1-2 (Semanas 1-4): Fundação**
- Setup de infraestrutura (repos, CI/CD, ambientes)
- Arquitetura de microserviços base
- Sistema de autenticação (email/OAuth)
- Modelo de dados inicial
- APIs básicas (CRUD de usuários e lugares)

**Sprint 3-4 (Semanas 5-8): Core Features**
- Questionário de preferências
- Sistema de recomendações v1 (algoritmo simples)
- Tela de feed com cards de lugares
- Tela de detalhes de lugares
- Integração Google Maps (visualização)
- Sistema de XP e níveis básico

**Sprint 5-6 (Semanas 9-12): Gamificação e Navegação**
- Sistema de check-in com geolocalização
- Navegação básica (Google Maps integration)
- Desafios diários (geração automática)
- Sistema de badges (10 badges iniciais)
- Perfil de usuário com estatísticas
- Sistema de avaliações

**Entregáveis MVP:**
- ✅ App mobile (iOS + Android)
- ✅ Recomendações personalizadas
- ✅ Navegação integrada
- ✅ Gamificação básica (XP, níveis, badges, desafios)
- ✅ Check-ins e avaliações
- ✅ 5 parceiros piloto

---

### Fase 2: Crescimento (3 meses)
**Objetivo:** Expandir funcionalidades e parcerias

**Sprint 7-8 (Semanas 13-16): Parcerias**
- Sistema de parceiros (cadastro, perfil)
- Benefícios e QR codes
- Validação de benefícios em tempo real
- Dashboard para parceiros (web)
- Sistema de loja de recompensas
- 30 novos parceiros

**Sprint 9-10 (Semanas 17-20): Social e Engajamento**
- Sistema de amigos
- Feed de atividades de amigos
- Compartilhamento social
- Rankings (global, cidade, amigos)
- Desafios semanais e especiais
- Notificações push inteligentes

**Sprint 11-12 (Semanas 21-24): Otimização**
- Algoritmo de recomendação v2 (ML básico)
- Cálculo de rotas otimizadas
- Integração com transporte público
- Modo offline básico
- Sistema de suporte (FAQ + chat)
- Analytics e métricas

**Entregáveis Fase 2:**
- ✅ 50+ parceiros ativos
- ✅ Features sociais completas
- ✅ Sistema de recompensas funcionando
- ✅ 10.000 usuários ativos
- ✅ Taxa de retenção D30: 40%

---

### Fase 3: Escala (3 meses)
**Objetivo:** Escalar produto e expandir geograficamente

**Sprint 13-14 (Semanas 25-28): Expansão**
- Suporte multi-cidade (3 cidades brasileiras)
- Integração com mais APIs de transporte
- Sistema de segurança e alertas
- Compartilhamento de localização
- Recomendações baseadas em ML (TensorFlow)

**Sprint 15-16 (Semanas 29-32): Monetização**
- Sistema de assinatura premium
- Recursos exclusivos premium
- Analytics avançado para parceiros
- Sistema de comissões automático
- Programa de afiliados

**Sprint 17-18 (Semanas 33-36): Refinamento**
- Otimizações de performance
- A/B testing de features
- Internacionalização (preparação)
- Tutoriais interativos
- Programa de embaixadores

**Entregáveis Fase 3:**
- ✅ 3 cidades cobertas
- ✅ 100+ parceiros ativos
- ✅ 50.000 usuários ativos
- ✅ Receita recorrente estabelecida
- ✅ Taxa de retenção D30: 60%

---

### Fase 4: Maturidade (3+ meses)
**Objetivo:** Consolidar posição e expandir internacionalmente

- Expansão para 10+ cidades brasileiras
- Versão internacional (inglês/espanhol)
- Integrações avançadas (booking, pagamentos)
- Features de IA avançadas
- Marketplace de experiências

---

## 11. Estimativas e Recursos

### 11.1 Equipe Recomendada

**Fase MVP (3 meses):**
- 1 Product Owner
- 1 Tech Lead
- 2 Backend Developers (Java/Spring)
- 2 Mobile Developers (React Native)
- 1 UI/UX Designer
- 1 QA Engineer
- 1 DevOps Engineer (part-time)
- **Total: 8-9 pessoas**

**Fase Crescimento (3 meses):**
- Mesma equipe + 1 Backend Developer adicional
- **Total: 9-10 pessoas**

**Fase Escala:**
- Expansão para 12-15 pessoas (adicionar data scientist, marketing, suporte)

### 11.2 Orçamento Estimado (MVP - 3 meses)

| Item | Custo Mensal | Custo Total (3 meses) |
|------|--------------|----------------------|
| Equipe (8 pessoas) | R$ 120.000 | R$ 360.000 |
| Infraestrutura Cloud | R$ 5.000 | R$ 15.000 |
| APIs (Google Maps, etc) | R$ 2.000 | R$ 6.000 |
| Ferramentas Dev | R$ 1.500 | R$ 4.500 |
| Design/UI Resources | R$ 2.000 | R$ 6.000 |
| Legal/Contabilidade | R$ 1.500 | R$ 4.500 |
| Marketing (soft launch) | R$ 5.000 | R$ 15.000 |
| Contingência (10%) | - | R$ 41.100 |
| **TOTAL** | **R$ 137.000** | **R$ 452.100** |

---

## 12. Riscos e Mitigações

### Risco 1: Baixa Adoção Inicial
**Probabilidade:** Média  
**Impacto:** Alto  
**Mitigação:**
- Parcerias estratégicas com influencers locais
- Programa de early adopters com recompensas
- Marketing focado em nicho específico inicialmente
- Gamificação forte no onboarding

### Risco 2: Dificuldade em Conseguir Parceiros
**Probabilidade:** Média  
**Impacto:** Alto  
**Mitigação:**
- MVP pode funcionar sem parceiros (foco em recomendações)
- Time dedicado para aquisição de parceiros
- Proposta de valor clara com ROI demonstrável
- Começar com parceiros menores, mais acessíveis

### Risco 3: Complexidade Técnica de Navegação
**Probabilidade:** Baixa  
**Impacto:** Médio  
**Mitigação:**
- Usar Google Maps SDK (maduro e confiável)
- Fallback para deep link para Google Maps/Waze
- Navegação básica é suficiente para MVP

### Risco 4: Problemas de Performance/Escalabilidade
**Probabilidade:** Média  
**Impacto:** Médio  
**Mitigação:**
- Arquitetura de microserviços desde o início
- Cache agressivo (Redis)
- CDN para assets estáticos
- Monitoramento proativo

### Risco 5: Custos de API (Google Maps)
**Probabilidade:** Baixa  
**Impacto:** Médio  
**Mitigação:**
- Monitorar uso de perto
- Otimizar chamadas de API
- Considerar alternativas open-source (OpenStreetMap) para features não críticas
- Cache de resultados quando possível

### Risco 6: Conformidade LGPD
**Probabilidade:** Baixa  
**Impacto:** Alto  
**Mitigação:**
- Consultor jurídico desde o início
- Política de privacidade clara
- Consentimento explícito em todas as coletas de dados
- Sistema de exportação/exclusão de dados

---

## 13. Métricas de Sucesso Detalhadas

### 13.1 Métricas de Produto (OKRs)

**Objetivo 1: Engajamento do Usuário**
- KR1: DAU/MAU ratio > 40%
- KR2: Sessões por usuário/dia > 3
- KR3: Tempo médio no app > 15 min/dia
- KR4: Taxa de retenção D1 > 60%, D7 > 45%, D30 > 30%

**Objetivo 2: Gamificação Efetiva**
- KR1: 70% dos usuários completam pelo menos 1 desafio/semana
- KR2: Média de 5 badges por usuário ativo
- KR3: 50% dos usuários fazem pelo menos 1 check-in/semana
- KR4: Taxa de conclusão de desafios diários > 40%

**Objetivo 3: Conversão e Monetização**
- KR1: 15% dos usuários visitam parceiros via app
- KR2: 10% dos usuários resgatam benefícios
- KR3: Taxa de conversão para premium > 5%
- KR4: LTV > 3x CAC

**Objetivo 4: Crescimento**
- KR1: Crescimento orgânico > 20% mês a mês
- KR2: K-factor (viralidade) > 1.2
- KR3: 50% de novos usuários vêm de referrals/social
- KR4: Cobertura de 3 cidades com densidade > 50 lugares

### 13.2 Métricas de Negócio

**Receita:**
- MRR (Monthly Recurring Revenue)
- Comissões de parceiros
- Receita de assinaturas premium

**Custos:**
- CAC (Customer Acquisition Cost) < R$ 10
- Custo de API por usuário/mês < R$ 0,50
- Custo de infraestrutura por usuário/mês < R$ 0,30

**Parcerias:**
- Número de parceiros ativos
- Taxa de renovação de parceiros > 80%
- GMV (Gross Merchandise Value) gerado para parceiros

---

## 14. Considerações de Segurança e Privacidade

### 14.1 Proteção de Dados (LGPD)

**Dados Coletados:**
- Dados cadastrais: email, nome, foto (opcional)
- Dados de localização: GPS em tempo real (com consentimento)
- Dados de uso: check-ins, avaliações, preferências
- Dados de dispositivo: tipo, versão OS (para analytics)

**Princípios:**
- **Transparência:** Política de privacidade clara e acessível
- **Consentimento:** Opt-in explícito para cada tipo de coleta
- **Minimização:** Coletar apenas dados necessários
- **Finalidade:** Usar dados apenas para propósito informado
- **Direitos:** Usuário pode acessar, corrigir, exportar e deletar dados

**Implementação:**
- Consent management system no onboarding
- Opção de anonimização para analytics
- Criptografia end-to-end para dados sensíveis
- Auditoria de acessos a dados

### 14.2 Segurança Técnica

**Autenticação:**
- OAuth 2.0 com tokens JWT
- Senha: bcrypt com salt (12 rounds)
- 2FA opcional (SMS/Email)
- Sessões com timeout

**Comunicação:**
- HTTPS obrigatório (TLS 1.3)
- Certificate pinning no mobile
- API Gateway com WAF

**Autorização:**
- RBAC (Role-Based Access Control)
- Princípio de menor privilégio
- Validação de permissões em cada request

**Dados:**
- Criptografia em repouso (AES-256)
- Backup criptografado
- Anonymization em logs e analytics

---

## 15. Plano de Lançamento

### 15.1 Beta Fechado (Semana 11-12)

**Objetivos:**
- Validar funcionalidades core
- Identificar bugs críticos
- Coletar feedback qualitativo

**Estratégia:**
- 100-200 beta testers selecionados
- Mix de personas (mochileiros, famílias, exploradores)
- Programa de incentivos (XP bônus, badges exclusivos)
- Formulário de feedback integrado no app
- Sessões semanais de feedback ao vivo

**Critérios de Sucesso:**
- 80% dos testers completam onboarding
- 60% fazem pelo menos 3 check-ins
- 70% completam pelo menos 1 desafio
- Menos de 5 bugs críticos
- NPS > 40

### 15.2 Beta Aberto (Semana 13-14)

**Objetivos:**
- Testar escalabilidade
- Validar modelo de aquisição
- Gerar buzz inicial

**Estratégia:**
- Lançar para público geral com cadastro
- Campanha em redes sociais
- Parcerias com blogs de turismo
- Press release para tech media
- 5 parceiros piloto ativos

**Meta:**
- 1.000 usuários registrados
- 500 usuários ativos semanalmente
- Taxa de retenção D7 > 40%

### 15.3 Lançamento Público (Semana 15)

**Objetivos:**
- Lançamento oficial nas lojas
- Campanha de marketing completa
- Estabelecer presença no mercado

**Estratégia:**
- Lançamento nas lojas Apple e Google
- Campanha de mídia paga (Instagram, Facebook, Google Ads)
- Parcerias com influencers de turismo
- Evento de lançamento (presencial ou virtual)
- PR em veículos de tech e turismo

**Meta:**
- 5.000 usuários no primeiro mês
- 20 parceiros ativos
- Rating 4.5+ nas lojas

---

## 16. Apêndices

### A. Glossário

- **XP (Experience Points):** Pontos de experiência ganhos por ações no app
- **Badge:** Conquista visual desbloqueada ao cumprir critérios específicos
- **Check-in:** Registro de visita a um lugar, validado por geolocalização
- **Desafio:** Missão com objetivo específico e prazo para completar
- **Nível:** Classificação do usuário baseada em XP total acumulado
- **Parceiro:** Estabelecimento comercial com perfil e benefícios no app
- **Benefício:** Desconto ou vantagem oferecida por parceiro
- **Recompensa:** Item do catálogo que pode ser adquirido com pontos
- **Rota:** Sequência de lugares a visitar com navegação otimizada

### B. Referências

[1] Dados de crescimento do turismo digital - Referência das pesquisas realizadas  
[2] Uso de smartphones em viagens - Referência das pesquisas realizadas  
[3] Gamificação e retenção - Referência das pesquisas realizadas  
[4] Impacto de recomendações personalizadas - Referência das pesquisas realizadas

### C. Histórico de Versões

| Versão | Data | Autor | Mudanças |
|--------|------|-------|----------|
| 1.0 | 09/02/2026 | Product Team | Documento inicial completo |

---

## Contatos

**Product Owner:** [nome@empresa.com]  
**Tech Lead:** [nome@empresa.com]  
**Stakeholders:** [lista de contatos]

---

**Status do Documento:** Draft - Aguardando Revisão  
**Próxima Revisão:** 16/02/2026  
**Aprovação Necessária:** C-Level, Tech Lead, Design Lead

---

*Este PRD é um documento vivo e será atualizado conforme o produto evolui e novos aprendizados são incorporados.*