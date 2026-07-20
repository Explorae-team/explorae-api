const { chromium } = require('playwright');
const path = require('path');

(async () => {
  console.log('Iniciando teste automatizado do Toast...');

  // Inicia o browser em modo headless para rodar em background
  const browser = await chromium.launch({
    headless: true,
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 }
  });

  const page = await context.newPage();

  page.on('console', msg => {
    console.log(`[Navegador Console] [${msg.type()}] ${msg.text()}`);
  });

  page.on('pageerror', err => {
    console.error('[Navegador Erro de Página]', err.stack || err.message);
  });

  const email = `toast-test-${Date.now()}@explorae.com`;
  const senha = 'toasttest123';

  try {
    const preencherCampo = async (locator, valor) => {
      await locator.evaluate((el, val) => {
        const prototype = window.HTMLInputElement.prototype;
        const descriptor = Object.getOwnPropertyDescriptor(prototype, 'value');
        if (descriptor && descriptor.set) {
          descriptor.set.call(el, val);
        } else {
          el.value = val;
        }
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
      }, valor);
      await page.waitForTimeout(100);
    };

    console.log('1. Navegando para a página de login...');
    await page.goto('http://localhost:8081/login');
    await page.waitForLoadState('networkidle');

    console.log('2. Redirecionando para Cadastro...');
    await page.click('text=Cadastre-se');
    await page.waitForURL('**/cadastro');

    console.log('3. Preenchendo dados de registro...');
    const inputNome = page.locator('[placeholder="Seu nome de explorador"]');
    const inputEmail = page.locator('[placeholder="email@exemplo.com"]');
    const inputSenha = page.locator('[placeholder="••••••••"]').filter({ visible: true }).nth(0);
    const inputConfirmar = page.locator('[placeholder="••••••••"]').filter({ visible: true }).nth(1);

    await preencherCampo(inputNome, 'Testador de Toast');
    await preencherCampo(inputEmail, email);
    await preencherCampo(inputSenha, senha);
    await preencherCampo(inputConfirmar, senha);

    console.log('4. Aceitando os termos...');
    await page.click('text=Aceito os Termos e Condições', { force: true });
    await page.waitForTimeout(200);

    console.log('5. Enviando cadastro...');
    await page.click('text=CRIAR CONTA', { force: true });

    console.log('Aguardando redirecionamento pós-cadastro...');
    await page.waitForURL('**/login', { timeout: 15000 });

    console.log('6. Efetuando o Login...');
    const loginEmail = page.locator('[placeholder="aventureiro@explorae.com"]').filter({ visible: true }).first();
    const loginSenha = page.locator('[placeholder="••••••••"]').filter({ visible: true }).first();

    await preencherCampo(loginEmail, email);
    await preencherCampo(loginSenha, senha);

    console.log('7. Clicando em Login...');
    await page.locator('text=LOGIN').filter({ visible: true }).first().click({ force: true });

    console.log('Aguardando redirecionamento para o onboarding (/preferences)...');
    await page.waitForURL('**/preferences', { timeout: 15000 });

    console.log('8. Preenchendo Wizard de onboarding...');
    await page.waitForSelector('text=Carregando catálogo...', { state: 'detached', timeout: 15000 });
    
    // Passo 1: Gastronomia
    console.log('Passo 1: Selecionando interesse...');
    await page.click('text=Sabor Local', { force: true }).catch(() => {});
    await page.waitForTimeout(500);
    console.log('Passo 1: Clicando em PRÓXIMO...');
    await page.click('text=PRÓXIMO', { force: true });
    await page.waitForTimeout(1000);

    // Passo 2: Cultura
    console.log('Passo 2: Clicando em PRÓXIMO...');
    await page.click('text=PRÓXIMO', { force: true });
    await page.waitForTimeout(1000);

    // Passo 3: Aventura
    console.log('Passo 3: Clicando em PRÓXIMO...');
    await page.click('text=PRÓXIMO', { force: true });
    await page.waitForTimeout(1000);

    // Passo 4: Relaxamento
    console.log('Passo 4: Clicando em PRÓXIMO...');
    await page.click('text=PRÓXIMO', { force: true });
    await page.waitForTimeout(1000);

    // Passo 5: Noite -> Concluir
    console.log('Passo 5: Clicando em CONCLUIR...');
    await page.click('text=CONCLUIR', { force: true }).catch(() => {});
    
    await page.waitForURL('**/dashboard', { timeout: 25000 });
    await page.waitForLoadState('networkidle');
    console.log('✔ Usuário de teste logado no Dashboard.');

    console.log('9. Navegando diretamente para a atração testada...');
    await page.goto('http://localhost:8081/attraction/bf124eb8-f59e-5b8e-b731-726df87325fe');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000); // Aguarda renderizar o conteúdo

    console.log('10. Clicando em "ADICIONAR AO ROTEIRO"...');
    const btnAdicionar = page.locator('text=ADICIONAR AO ROTEIRO').first();
    await btnAdicionar.scrollIntoViewIfNeeded();
    await btnAdicionar.click({ force: true });
    
    console.log('11. Aguardando 1 segundo para a renderização do Toast...');
    await page.waitForTimeout(1000);

    // Salva o screenshot do Toast renderizado na web
    const screenshotPath = 'C:\\Users\\italo\\.gemini\\antigravity-ide\\brain\\b80a874c-9b06-44b6-b982-21d00aee9f95\\toast_web_success.png';
    console.log(`12. Salvando screenshot do Toast em: ${screenshotPath}`);
    await page.screenshot({ path: screenshotPath });
    
    console.log('✔ Teste do Toast finalizado com sucesso!');
  } catch (error) {
    console.error('❌ Ocorreu um erro no teste:', error);
    await page.screenshot({ path: 'C:\\Users\\italo\\.gemini\\antigravity-ide\\brain\\b80a874c-9b06-44b6-b982-21d00aee9f95\\toast_web_error.png' }).catch(() => {});
  } finally {
    await browser.close();
  }
})();
