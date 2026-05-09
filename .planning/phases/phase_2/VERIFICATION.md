# Verification: Phase 2 (SDGEU-191)

## Acceptance Criteria (UAT)

### TRAV-02: Consulta de Preferências (GET)
- [ ] O endpoint `GET /api/v1/users/me/preferences` retorna status 200 OK.
- [ ] O corpo da resposta segue o padrão `StandardResponseDTO<List<String>>`.
- [ ] A lista de interesses retornada reflete exatamente o que está persistido no banco.

### TRAV-03: Atualização de Preferências (PUT)
- [x] O endpoint `PUT /api/v1/users/me/preferences` retorna status 200 OK após atualização.
- [x] O método é idempotente (múltiplas chamadas com o mesmo corpo resultam no mesmo estado).
- [ ] Se o corpo for inválido (ex: interesses nulos quando obrigatórios), retorna 400 Bad Request com detalhes em `errors`.

### Padronização de Erros
- [x] Falhas de autenticação (Token inválido/ausente) retornam 401 Unauthorized via `StandardResponseDTO`.
- [ ] Exceções não tratadas retornam 500 Internal Server Error no formato `StandardResponseDTO`.
- [x] O campo `errors` é preenchido apenas quando há detalhes (ex: validação de campos).

## Automated Tests
- [ ] `TravelPreferenceApiTest`: Cobre fluxos de sucesso e erro.
- [ ] `mvn test` no diretório `/backend`.
 Swagger ou Postman.
