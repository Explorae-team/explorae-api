# Phase 5 Context: Gamificação (XP e Níveis)

## 🎯 Escopo
Implementar a lógica de progressão do usuário, histórico de XP e conquista de medalhas no backend.

## 🛠️ Decisões Técnicas

### 1. Arquitetura de Eventos (Spring Events)
- **Desacoplamento**: O sistema usará `ApplicationEventPublisher`. 
- **Eventos Iniciais**: `PreferenceCompletedEvent`, `FavoriteCreatedEvent`, `DestinationReachedEvent`, `ReviewCreatedEvent`.
- **Listener**: `GamificationListener` será responsável por capturar esses eventos e chamar o `GamificationService`.

### 2. Regras de Gamificação
- **Nível Inicial**: 1.
- **Fórmula de Level Up**: `xp >= nivel * 100`.
- **Tabela de Recompensas**:
    - Onboarding: 100 XP.
    - Primeiro Favorito: 10 XP + Badge `COLECIONADOR`.
    - Primeiro Destino: 50 XP + Badge `DESBRAVADOR`.
    - 3 Destinos: 150 XP + Badge `EXPLORADOR`.
    - Primeira Avaliação: 30 XP + Badge `CRITICO`.

### 3. Armazenamento de Imagens (Badges)
- **Local Storage**: As imagens das medalhas serão armazenadas em `backend/uploads/badges/`.
- **URL Dinâmica**: O serviço de Storage retornará a URL completa baseada no host atual (facilitando o consumo pelo frontend).
- **Abstração**: Interface `FileStorageService` para permitir troca futura por bucket remoto (S3/Cloud).

### 4. Persistência
- **XpHistory**: Registrar cada ganho de XP com descrição e timestamp.
- **UserBadge**: Registrar data da conquista da medalha.

---
*Decidido em: 09 de maio de 2026*
