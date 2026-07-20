const { chromium } = require('playwright');
const path = require('path');

(async () => {
  console.log('Iniciando o teste E2E do Exploraê usando Playwright...');

  // Lança o navegador em modo headed (visível para o usuário) com um pequeno delay para scaneabilidade visual
  const browser = await chromium.launch({
    headless: false,
    slowMo: 1000 // Atraso de 1s para visualização fluida e detalhada das ações
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 }
  });

  const page = await context.newPage();
  const email = `playwright-${Date.now()}@explorae.com`;
  const senha = 'playwright123';

  try {
    // 1. Acessa a URL da aplicação Expo Web
    console.log('1. Navegando para o portal de login local...');
    await page.goto('http://localhost:8081/login');
    await page.waitForLoadState('networkidle');

    // 2. Navega para a tela de Cadastro
    console.log('2. Clicando no link para registrar-se...');
    await page.click('text=Cadastre-se');
    await page.waitForURL('**/cadastro');

    // 3. Preenche a ficha de cadastro
    console.log('3. Preenchendo dados de registro...');
    await page.fill('placeholder=Seu nome de explorador', 'Aventureiro Playwright');
    await page.fill('placeholder=email@exemplo.com', email);
    
    // As duas senhas possuem o mesmo placeholder, preenche a primeira e a segunda separadamente
    const passwordInputs = page.locator('placeholder=••••••••');
    await passwordInputs.nth(0).fill(senha);
    await passwordInputs.nth(1).fill(senha);

    // Aceita os termos de aventura
    console.log('4. Aceitando os termos e condições...');
    await page.click('text=Aceito os Termos e Condições');

    // Clica no botão de registro
    console.log('5. Enviando formulário de cadastro...');
    await page.click('text=CRIAR CONTA');

    // Aguarda o redirecionamento automático de volta para o Login
    console.log('Aguardando redirecionamento para o login pós-cadastro...');
    await page.waitForURL('**/login');

    // 4. Efetua o Login
    console.log('6. Preenchendo dados de autenticação...');
    await page.fill('placeholder=aventureiro@explorae.com', email);
    await page.locator('placeholder=••••••••').fill(senha);

    console.log('7. Clicando em Login...');
    await page.click('text=LOGIN');

    // Como o usuário é novo e não possui preferências, deve ser forçado ao Onboarding (/preferences)
    console.log('Aguardando redirecionamento forçado para o onboarding (/preferences)...');
    await page.waitForURL('**/preferences');

    // 5. Preenchimento de preferências (Wizard Onboarding)
    console.log('8. Iniciando seleção de interesses do explorador...');
    
    // Aguarda os cards de interesse carregarem
    await page.waitForSelector('text=Carregando catálogo...', { state: 'detached', timeout: 15000 });
    
    // Clica nos dois primeiros cards de interesse visíveis
    const interestCards = page.locator('div[style*="flex-direction: column"]');
    if (await interestCards.count() > 0) {
      console.log('Selecionando interesses...');
      await interestCards.nth(0).click();
      await page.waitForTimeout(500);
      await interestCards.nth(1).click();
    } else {
      // Fallback se não conseguir os locators específicos
      console.log('Usando fallback para cliques nos cards...');
      await page.locator('text=Ecoturismo').click().catch(() => {});
      await page.locator('text=Museus').click().catch(() => {});
    }

    console.log('Avançando no Wizard...');
    await page.click('text=PRÓXIMO');
    await page.waitForTimeout(1000);

    // Passo 2 do Wizard (Aventura / Cultura)
    console.log('Passo 2 do Wizard: selecionando interesses...');
    if (await interestCards.count() > 2) {
      await interestCards.nth(2).click();
    }
    await page.click('text=PRÓXIMO');
    await page.waitForTimeout(1000);

    // Passo final do Wizard: Concluir
    console.log('Concluindo o Onboarding...');
    await page.click('text=CONCLUIR');

    // Deve redirecionar para a tela principal (Dashboard Explore)
    console.log('Aguardando redirecionamento para o Dashboard de Atrações (/dashboard)...');
    await page.waitForURL('**/dashboard');
    await page.waitForLoadState('networkidle');

    console.log('[Sucesso] Redirecionado para o feed paginado com êxito!');
    
    // 6. Tira screenshot do Dashboard com as atrações carregadas reais!
    const screenshotPath = path.join(__dirname, 'dashboard_success.png');
    console.log(`9. Registrando o sucesso do teste. Salvando screenshot em: ${screenshotPath}`);
    await page.screenshot({ path: screenshotPath });

    console.log('\n=========================================');
    console.log('🎉 TESTE E2E EXECUTADO COM 100% DE SUCESSO!');
    console.log('=========================================');

    // Mantém o navegador aberto por 5 segundos para que o usuário contemple o resultado final na tela
    console.log('Mantendo o navegador aberto por 5 segundos para visualização do usuário...');
    await page.waitForTimeout(5000);

  } catch (error) {
    console.error('❌ Falha na execução do teste E2E:', error);
    // Tira uma foto da tela em caso de erro para auxiliar no debug
    await page.screenshot({ path: path.join(__dirname, 'e2e_error.png') }).catch(() => {});
  } finally {
    console.log('Finalizando o navegador...');
    await browser.close();
  }
})();
