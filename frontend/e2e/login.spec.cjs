/**
 * Especificação E2E - Autenticação (Login)
 * Valida a autenticação do explorador recém-criado e o redirecionamento de onboarding.
 */
async function runLogin(page, state, preencherCampo) {
  console.log('--- Iniciando Etapa: Autenticação (Login) ---');

  console.log(`Preenchendo dados de login para o aventureiro: ${state.email}...`);
  
  const loginEmail = page.locator('[placeholder="aventureiro@explorae.com"]').filter({ visible: true }).first();
  const loginSenha = page.locator('[placeholder="••••••••"]').filter({ visible: true }).first();

  await preencherCampo(loginEmail, state.email);
  await preencherCampo(loginSenha, state.senha);

  console.log('Clicando em LOGIN...');
  await page.locator('text=LOGIN').filter({ visible: true }).first().click({ force: true });

  // Como o usuário é novo e não possui preferências, deve ser forçado ao Onboarding (/preferences)
  console.log('Aguardando redirecionamento forçado para o onboarding (/preferences)...');
  await page.waitForURL('**/preferences', { timeout: 15000 });

  console.log('✔ [Login] Autenticação realizada com sucesso! Redirecionado para preferências.');
}

module.exports = { runLogin };
