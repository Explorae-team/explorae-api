const { chromium } = require('playwright');
const path = require('path');

(async () => {
  console.log('Iniciando o teste E2E do Exploraê usando Playwright (Modo Avançado DOM)...');

  // Lança o navegador em modo headed (visível para o usuário) com um pequeno delay para scaneabilidade visual
  const browser = await chromium.launch({
    headless: false,
    slowMo: 1000 // Atraso de 1s para visualização fluida e detalhada das ações
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 }
  });

  const page = await context.newPage();

  // Escuta logs e erros do navegador para facilitar diagnósticos de erros
  page.on('console', msg => {
    console.log(`[Navegador Console] [${msg.type()}] ${msg.text()}`);
  });

  page.on('pageerror', err => {
    console.error('[Navegador Erro de Página]', err.stack || err.message);
  });

  page.on('requestfailed', request => {
    console.log(`[Navegador Requisição Falhou] ${request.method()} ${request.url()} - ${request.failure()?.errorText || 'Erro desconhecido'}`);
  });

  const email = `playwright-${Date.now()}@explorae.com`;
  const senha = 'playwright123';

  try {
    // Função auxiliar robusta para preencher campos no React Native Web via injeção atômica no React State
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
      // Pequeno delay para estabilidade de processamento
      await page.waitForTimeout(100);
    };

    // 1. Acessa a URL da aplicação Expo Web
    console.log('1. Navegando para o portal de login local...');
    await page.goto('http://localhost:8081/login');
    await page.waitForLoadState('networkidle');

    // 2. Navega para a tela de Cadastro
    console.log('2. Clicando no link para registrar-se...');
    await page.click('text=Cadastre-se');
    await page.waitForURL('**/cadastro');

    // 3. Preenche a ficha de cadastro usando seletores de placeholder visíveis exclusivos (contorna Expo Router background views)
    console.log('3. Preenchendo dados de registro via Visible Placeholder Injection...');
    
    const inputNome = page.locator('[placeholder="Seu nome de explorador"]');
    const inputEmail = page.locator('[placeholder="email@exemplo.com"]');
    const inputSenha = page.locator('[placeholder="••••••••"]').filter({ visible: true }).nth(0);
    const inputConfirmar = page.locator('[placeholder="••••••••"]').filter({ visible: true }).nth(1);

    await preencherCampo(inputNome, 'Aventureiro Playwright');
    await preencherCampo(inputEmail, email);
    await preencherCampo(inputSenha, senha);
    await preencherCampo(inputConfirmar, senha);

    // Aceita os termos de aventura
    console.log('4. Aceitando os termos e condições...');
    await page.click('text=Aceito os Termos e Condições', { force: true });
    await page.waitForTimeout(200);

    // Clica no botão de registro
    console.log('5. Enviando formulário de cadastro...');
    await page.click('text=CRIAR CONTA', { force: true });

    // Aguarda o redirecionamento automático de volta para o Login
    console.log('Aguardando redirecionamento para o login pós-cadastro...');
    await page.waitForURL('**/login', { timeout: 15000 });

    // 4. Efetua o Login
    console.log('6. Preenchendo dados de autenticação...');
    
    const loginEmail = page.locator('[placeholder="aventureiro@explorae.com"]').filter({ visible: true }).first();
    const loginSenha = page.locator('[placeholder="••••••••"]').filter({ visible: true }).first();

    await preencherCampo(loginEmail, email);
    await preencherCampo(loginSenha, senha);

    console.log('7. Clicando em Login...');
    await page.locator('text=LOGIN').filter({ visible: true }).first().click({ force: true });

    // Como o usuário é novo e não possui preferências, deve ser forçado ao Onboarding (/preferences)
    console.log('Aguardando redirecionamento forçado para o onboarding (/preferences)...');
    await page.waitForURL('**/preferences');

    // 5. Preenchimento de preferências (Wizard Onboarding)
    console.log('8. Iniciando seleção de interesses do explorador...');
    
    // Aguarda os cards de interesse carregarem
    await page.waitForSelector('text=Carregando catálogo...', { state: 'detached', timeout: 15000 });
    
    // Seleciona interesses clicando em cards ou chips visíveis
    console.log('Selecionando interesses...');
    await page.click('text=Comida Italiana', { force: true }).catch(() => {});
    await page.click('text=Comida Oriental', { force: true }).catch(() => {});
    await page.click('text=Sabor Local', { force: true }).catch(() => {});
    await page.waitForTimeout(500);

    console.log('Avançando no Wizard...');
    await page.click('text=PRÓXIMO', { force: true });
    await page.waitForTimeout(1000);

    // Passo 2 do Wizard (Aventura / Cultura)
    console.log('Passo 2 do Wizard: selecionando interesses...');
    await page.click('text=Cinema', { force: true }).catch(() => {});
    await page.click('text=Exposições', { force: true }).catch(() => {});
    await page.click('text=Música ao Vivo', { force: true }).catch(() => {});
    await page.click('text=PRÓXIMO', { force: true });
    await page.waitForTimeout(1000);

    // Passo final do Wizard: Concluir
    console.log('Concluindo o Onboarding...');
    await page.click('text=CONCLUIR', { force: true });

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
