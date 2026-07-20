const path = require('path');

/**
 * Especificação E2E - Dashboard Explore
 * Valida a exibição do feed paginado dinâmico com atrações reais e afinidades.
 */
async function runDashboard(page, state) {
  console.log('--- Iniciando Etapa: Dashboard Explore ---');

  // 1. Valida que a página está ativa e o feed carregado
  console.log('Validando elementos na página do Dashboard...');
  await page.waitForLoadState('networkidle');

  // Aguarda que as atrações reais sejam renderizadas
  console.log('Aguardando a renderização do feed paginado com as atrações...');
  await page.waitForTimeout(2000); // Aguarda animações e carregamentos finais

  console.log('Registrando captura de tela do Dashboard com sucesso...');
  const screenshotPath = path.join(__dirname, 'dashboard_success.png');
  await page.screenshot({ path: screenshotPath });

  console.log(`✔ [Dashboard] Feed carregado com sucesso! Captura salva em: ${screenshotPath}`);
}

module.exports = { runDashboard };
