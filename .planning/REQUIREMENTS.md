# Requirements - Sprint 06

## Overview
A Sprint 06 focará na robustez da experiência de uso do Exploraê em ambientes com conectividade restrita (suporte offline para favoritas e check-ins) e na notificação passiva baseada na localização em tempo real do dispositivo, disparando alertas georreferenciados em segundo plano.

## User Stories

### [SDGEU-OFFLINE] Suporte Offline e Sincronização
**Descrição**: Como um explorador, desejo visualizar minhas atrações favoritas cadastradas e realizar check-ins mesmo quando não tiver acesso à internet, para que minha experiência de viagem não seja interrompida.

- **Requisitos Funcionais**:
  - [ ] Integrar banco de dados local leve (SQLite / WatermelonDB) no Expo.
  - [ ] Salvar localmente dados de perfil, medalhas e atrações salvas como favoritos.
  - [ ] Criar buffer/fila de check-ins offline para reenvio e sincronização.
- **Critérios de Aceite**:
  - [ ] O app exibe o feed e a aba de favoritos no modo avião / sem internet.
  - [ ] O check-in realizado offline é armazenado localmente e enviado automaticamente para o backend assim que a internet é reestabelecida.

### [SDGEU-NOTIF] Notificações por Geofencing Passivo
**Descrição**: Como um explorador, desejo receber notificações automáticas no meu smartphone ao passar perto de um local histórico de interesse ou de uma atração parceira com descontos especiais, sem precisar estar com o app aberto.

- **Requisitos Funcionais**:
  - [ ] Implementar monitoramento de geofencing passivo em background no Expo.
  - [ ] Integrar com o serviço de notificações nativas do Android/iOS.
  - [ ] Configurar controle de frequência de notificações para evitar spam e economia de bateria.
- **Critérios de Aceite**:
  - [ ] O usuário recebe uma notificação local (push notification) ao entrar em um raio de 100m de uma atração ativa parceira, mesmo com o app em background ou fechado.
