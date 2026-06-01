/**
 * Especificação E2E - Perfil do Explorador & Medalhas/Badges
 * Valida a exibição do perfil de aventureiro e a aba de conquistas e badges integrados com o Spring Boot.
 */
async function runProfileAndBadges(page, state) {
  console.log('--- Iniciando Etapa: Perfil do Explorador & Medalhas ---');

  // 1. Acessa o perfil do explorador
  console.log('Navegando para o Perfil do Explorador...');
  await page.goto('http://localhost:8081/dashboard/profile');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);

  // 2. Valida o nome do aventureiro e a estrutura da página
  console.log('Validando informações do aventureiro logado...');
  // O ExplorerHeader exibe o nome do usuário logado.
  await page.waitForSelector('text=Aventureiro Playwright', { timeout: 15000 });

  // 3. Acessa a aba de Conquistas e Medalhas
  console.log('Navegando para a central de Medalhas e Conquistas...');
  await page.goto('http://localhost:8081/dashboard/badges');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);

  // 4. Valida elementos da tela de Badges
  console.log('Validando catálogo de medalhas carregadas do Spring Boot...');
  await page.waitForSelector('text=Conquistas & Desafios', { timeout: 15000 });
  await page.waitForSelector('text=Minha Coleção', { timeout: 15000 });

  // Valida a aba ativa de Medalhas
  const tabMedalhas = page.locator('text=Medalhas').filter({ visible: true }).first();
  await tabMedalhas.waitFor({ state: 'visible', timeout: 5000 });

  console.log('✔ [Perfil & Medalhas] Exibição de coleção de insígnias validada com sucesso!');
}

module.exports = { runProfileAndBadges };
