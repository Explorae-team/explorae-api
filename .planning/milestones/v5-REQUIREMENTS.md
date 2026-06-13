# Requirements - Sprint 05 (Archived Milestone)

## Overview
A Sprint 05 focou no desenvolvimento do fluxo de validação presencial das visitas (Check-In por Proximidade via GPS) para engajamento e gamificação ativa, e no sistema de resgate de vouchers/cupons em parceria com estabelecimentos locais para tangibilizar as recompensas do app Exploraê.

## User Stories

### [SDGEU-CHECKIN] Check-In por Proximidade
**Descrição**: Como um explorador, desejo realizar check-in ao me aproximar fisicamente de uma atração turística para registrar minha visita oficial e receber recompensas (XP, moedas virtuais e medalhas).

- **Requisitos Funcionais**:
  - [X] Validar no backend as coordenadas do usuário em relação à localização cadastrada da atração (raio padrão de proximidade de 50 metros).
  - [X] Interface no mobile com botão de check-in dinâmico ativo apenas quando o usuário estiver dentro do raio da atração.
  - [X] Adicionar transações no histórico de gamificação para registrar o ganho de recompensas de check-in.
  - [X] Feedbacks de animações visuais premium ao atingir level up após ganhar XP de check-in.
- **Critérios de Aceite**:
  - [X] O check-in só é permitido se a distância calculada for menor ou igual ao limite de proximidade configurado.
  - [X] O check-in deve ser único por atração a cada 24 horas (ou período configurado) para evitar abusos de ganho de XP.

### [SDGEU-VOUCHER] Sistema de Vouchers & Cupons
**Descrição**: Como um explorador, desejo trocar minhas moedas de exploração por cupons de desconto de parceiros locais para obter benefícios tangíveis nas minhas viagens.

- **Requisitos Funcionais**:
  - [X] Cadastro de parceiros comerciais e vouchers de descontos (Spring Boot, Liquibase).
  - [X] Fluxo de resgate de moedas virtuais por vouchers gerados em tempo real.
  - [X] Exibição da carteira de vouchers do usuário com status (Disponível, Resgatado, Expirado).
  - [X] Geração de QR Code e código alfanumérico exclusivo para cada cupom resgatado, para ser exibido e escaneado no estabelecimento parceiro.
- **Critérios de Aceite**:
  - [X] O usuário não pode resgatar um voucher se não tiver o saldo mínimo de moedas necessário.
  - [X] O status do voucher deve mudar para "Resgatado" quando validado e não pode ser reutilizado.
