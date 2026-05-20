# Plano de Execução - Phase 16: Supabase Storage

Este plano descreve a migração do armazenamento de imagens de atrações para o Supabase Storage, eliminando a dependência de URLs externas do Unsplash.

## 📋 Objetivos
- Configurar o cliente Supabase no Frontend (Expo).
- Implementar utilitário para gerar URLs públicas do Supabase Storage.
- Atualizar o hook `useExploreData` para priorizar imagens do Storage.
- Preparar o Backend para persistir caminhos de buckets em vez de URLs completas.

## 🛠️ Tarefas

### 1. Configuração do Frontend (Expo)
- [x] Instalar dependência `@supabase/supabase-js`.
- [x] Criar `frontend/src/services/supabase.ts` para inicializar o cliente com as chaves do `.env`.

### 2. Integração de Dados
- [x] Modificar `frontend/src/services/useExploreData.ts` para converter caminhos relativos (ex: `attractions/cristo.jpg`) em URLs públicas do Supabase usando o SDK.
- [x] Garantir fallback para URLs antigas (Unsplash) durante o período de transição.

### 3. Ajustes no Backend (Opcional/Preparatório)
- [x] Verificar se a entidade `Attraction` suporta caminhos de imagem.
- [ ] (Opcional) Criar script para upload inicial das imagens locais para o bucket do Supabase.

## 🧪 Verificação (UAT)
- [x] As imagens das atrações devem carregar corretamente no Dashboard.
- [x] Se uma imagem for um caminho do Supabase, ela deve ser resolvida via SDK.
- [x] Se for uma URL externa, deve continuar funcionando.

## 📅 Roadmap Context
- **Wave**: 6
- **Dependencies**: Phase 15 (Supabase DB)
