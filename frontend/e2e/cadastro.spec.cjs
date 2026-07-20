/**
 * Especificação E2E - Cadastro de Explorador
 * Valida a criação de conta de um novo usuário com dados válidos e aceite de termos.
 */
async function runCadastro(page, state, preencherCampo) {
  console.log('--- Iniciando Etapa: Cadastro de Explorador ---');
  
  // 1. Navega para o login e clica para cadastrar-se
  console.log('Navegando para o portal de login local...');
  await page.goto('http://localhost:8081/login');
  await page.waitForLoadState('networkidle');

  console.log('Clicando no link para registrar-se...');
  await page.locator('text=Cadastre-se').filter({ visible: true }).first().click({ force: true });
  await page.waitForURL('**/cadastro');

  // 2. Preenche dados de cadastro via injeção atômica
  console.log(`Preenchendo dados de registro para o e-mail: ${state.email}...`);
  
  const inputNome = page.locator('[placeholder="Seu nome de explorador"]');
  const inputEmail = page.locator('[placeholder="email@exemplo.com"]');
  const inputSenha = page.locator('[placeholder="••••••••"]').filter({ visible: true }).nth(0);
  const inputConfirmar = page.locator('[placeholder="••••••••"]').filter({ visible: true }).nth(1);

  await preencherCampo(inputNome, 'Aventureiro Playwright');
  await preencherCampo(inputEmail, state.email);
  await preencherCampo(inputSenha, state.senha);
  await preencherCampo(inputConfirmar, state.senha);

  // 3. Aceita os termos de aventura
  console.log('Aceitando os termos e condições de expedição...');
  await page.locator('text=Aceito os Termos e Condições').filter({ visible: true }).first().click({ force: true });
  await page.waitForTimeout(200);

  // 4. Envia o formulário
  console.log('Enviando formulário de cadastro...');
  await page.locator('text=CRIAR CONTA').filter({ visible: true }).first().click({ force: true });

  // 5. Aguarda o redirecionamento automático de volta para o Login
  console.log('Aguardando redirecionamento para o login pós-cadastro...');
  await page.waitForURL('**/login', { timeout: 15000 });
  
  console.log('✔ [Cadastro] Concluído com sucesso! Redirecionado para o login.');
}

module.exports = { runCadastro };
