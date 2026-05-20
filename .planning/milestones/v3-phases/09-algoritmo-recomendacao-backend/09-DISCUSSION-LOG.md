# Phase 9: [SDGEU-223] Criar Algoritmo de Recomendação Baseado em Preferências (Backend) - Discussion Log

**Date:** 2026-05-19
**Participants:** Antigravity (AI Architect) & Developer (User)

## Discussion Record

### Area 1: Algoritmo de Recomendação Adaptativo (v1.1)

#### Context & Gray Areas
O desenvolvedor questionou por que deveríamos optar por um algoritmo determinístico ponderado e de heurísticas em vez de modelos de Machine Learning (ML), dado que modelos de ML poderiam se adaptar ao uso contínuo do aplicativo pelo usuário.

#### Architectural Trade-offs Explored
1. **Cold Start:** Modelos clássicos de ML dependem de interações históricas densas de múltiplos usuários. No início do MVP do aplicativo, a recomendação de ML seria inexata ou randômica. A heurística com o onboarding explícito funciona imediatamente (100% de acerto inicial).
2. **Custos e Infraestrutura:** ML exige servidores adicionais (microsserviço Python Flask/FastAPI, TensorFlow/PyTorch), aumentando a fatura e a latência de rede. A solução em Java/Spring Boot tem latência próxima de zero e custo operacional nulo.
3. **Regras Comerciais:** O negócio precisa impulsionar atrações com o selo `isPartner` (BoostParceiro). Isso é determinístico na heurística de pesos e complexo em redes neurais de recomendação sem desviar o treinamento estatístico.

#### Alternative Chosen (Alternative 2 - Hybrid Match)
O desenvolvedor optou por incluir um mecanismo híbrido de **Preferências Implícitas (Adaptativas)** integrado de maneira leve e direta ao Spring Boot:
* **MatchPerfilHibrido = (0.70 × ScoreExplicito) + (0.30 × ScoreImplicito)**
* **ScoreExplicito:** Baseado no onboarding estático (TravelPreference).
* **ScoreImplicito:** Baseado nos últimos 20 cliques do usuário (registrados na nova entidade `UserInteraction` quando ele acessa os detalhes da atração). O algoritmo calcula a fração de cliques recentes na categoria e a utiliza para calibrar a relevância.

## Deferred Ideas (Backlog)
- *Nenhuma ideia adiada nesta sessão.*

---
*Discussion Log: b5d0acec-29ac-41fc-a456-9bd17a625b70*
