# VERIFICATION - Phase 7: Integração Filtros Backend

## 📋 Lista de Verificação

### Backend
- [X] O endpoint `/api/v1/attractions` aceita parâmetros de query.
- [X] Queries vazias retornam todos os resultados (mantém compatibilidade).
- [X] Filtro por nome é "case-insensitive" e busca parcial (LIKE %...%).

### Frontend
- [X] O hook `useExploreData` limpa a lista de atrações ao trocar de filtros (refresh total).
- [X] O scroll infinito continua funcionando após a filtragem.
- [X] O debounce de ~500ms está funcionando na barra de busca.

## 🛠️ Comandos de Teste
```bash
# Testar endpoint via CURL (exemplo)
curl -X GET "http://localhost:8080/api/v1/attractions?name=Farol&category=Cultura"
```
