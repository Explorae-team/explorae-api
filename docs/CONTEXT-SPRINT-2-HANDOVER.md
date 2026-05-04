# Handover Context: Sprint 2 - Exploraê

## 📅 Data: 15 de Abril de 2026
## 📌 Status Atual
- **Projeto:** Exploraê (MVP Turismo Gamificado).
- **Estado do Git:** Branch `develop` limpa e sincronizada com o remoto.
- **Backend:** Spring Boot 4.0.3, Java 25.
- **Frontend:** Expo (React Native).

## ✅ Progresso Recente
- Finalizada a pesquisa completa da base de código.
- Decidido manter o relacionamento `One-to-One` entre `User` e `TravelPreference` para o MVP.
- Criado o arquivo `TravelPreferenceRepository.java`.

## 🎯 Objetivo Imediato: SDGEU-191 (API de Preferências)
O usuário deseja implementar a API passo a passo, recebendo instruções de "o que fazer" para ele mesmo codificar/validar.

## 🚀 Próximas Instruções (Para a próxima instância)
1. **Passo 1:** Orientar o usuário a criar o `TravelPreferenceRequestDTO.java` no diretório `backend/src/main/java/br/edu/ifpb/explorae/api/dto/`.
2. **Campos do DTO:** `interests`, `budget`, `preferredTransport`.
3. **Passo 2:** Após o DTO, seguir para o Mapper (MapStruct), Service e Controller.
4. **Endpoint Alvo:** `PUT /api/v1/users/me/preferences` (e possivelmente um GET).

## 💡 Notas de Estilo
- Manter as mensagens e comentários em Português.
- Seguir o padrão `StandardResponseDTO` para todas as respostas da API.
- Foco em simplicidade (MVP).
