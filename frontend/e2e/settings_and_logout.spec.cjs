/**
 * Especificação E2E - Configurações, Edição de Preferências e Encerramento de Sessão (Logout)
 * Valida a reedição de interesses do Onboarding, a ação de Logout interativa e a segurança de rotas restritas.
 */
async function runSettingsAndLogout(page, state) {
  console.log('--- Iniciando Etapa: Configurações, Re-onboarding e Logout ---');

  // 1. Navega para a tela de configurações
  console.log('Navegando para a central de configurações...');
  await page.goto('http://localhost:8081/settings');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);

  // 2. Valida opções na tela de Configurações
  console.log('Validando opções da interface de Configurações...');
  await page.waitForSelector('text=Configurações', { timeout: 15000 });
  await page.waitForSelector('text=Preferências de Viagem', { timeout: 15000 });

  // 3. Clica para editar preferências (re-onboarding)
  console.log('Navegando para re-onboarding de preferências de viagem...');
  const itemPreferencias = page.locator('text=Preferências de Viagem').filter({ visible: true }).first();
  await itemPreferencias.click({ force: true });
  await page.waitForURL('**/preferences?mode=edit');
  await page.waitForTimeout(1500);

  console.log('Wizard de Edição carregado com sucesso. Voltando para as configurações...');
  await page.goto('http://localhost:8081/settings');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);

  // 4. Configura listener para aceitar o confirm() de Logout na web
  console.log('Configurando interceptador de confirmação de diálogo de Logout...');
  page.once('dialog', async dialog => {
    console.log(`[Dialog de QA] Tipo: ${dialog.type()}, Mensagem: "${dialog.message()}"`);
    if (dialog.message().includes("Deseja realmente sair da sua conta")) {
      await dialog.accept();
      console.log('✔ Dialog de Logout aceito programaticamente!');
    } else {
      await dialog.dismiss();
    }
  });

  // 5. Executa a ação de Logout
  console.log('Clicando no botão de Sair da Conta...');
  const btnLogout = page.locator('text=Sair da Conta').filter({ visible: true }).first();
  await btnLogout.click({ force: true });

  // 6. Atesta o redirecionamento automático para a tela de Login
  console.log('Validando redirecionamento para o login pós-logout...');
  await page.waitForURL('**/login', { timeout: 15000 });
  console.log('✔ Usuário redirecionado para a tela de login pública com sucesso.');

  // 7. Valida barreiras de segurança (Guarda de Rotas)
  console.log('Testando barreira de segurança: tentando acessar a rota protegida /dashboard sem login...');
  await page.goto('http://localhost:8081/dashboard');
  await page.waitForTimeout(2000);

  // Como o usuário não está logado, ele deve ser bloqueado e redirecionado de volta para o Onboarding/Login ou permanecer restrito
  console.log('Verificando se o usuário foi mantido fora do Dashboard...');
  const urlAtual = page.url();
  console.log(`URL resultante após tentativa de acesso não autorizado: ${urlAtual}`);
  
  if (urlAtual.includes('/dashboard')) {
    throw new Error('Falha de Segurança: Acesso não autorizado permitido ao Dashboard sem autenticação ativa!');
  } else {
    console.log('✔ Sucesso! O acesso não autorizado foi bloqueado de forma resiliente.');
  }

  console.log('✔ [Configurações & Segurança] Ciclo de vida de sessão e re-onboarding validados com êxito!');
}

module.exports = { runSettingsAndLogout };
