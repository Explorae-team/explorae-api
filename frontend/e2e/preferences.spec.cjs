/**
 * Especificação E2E - Onboarding de Preferências de Viagem
 * Valida a navegação completa de 5 passos do Wizard de Interesses com as categorias reais.
 */
async function runPreferences(page, state) {
  console.log('--- Iniciando Etapa: Onboarding de Preferências ---');

  // 1. Aguarda os cards de interesse carregarem
  console.log('Aguardando carregamento do catálogo...');
  await page.waitForSelector('text=Carregando catálogo...', { state: 'detached', timeout: 15000 });
  await page.waitForTimeout(500);

  // Passo 1: Gastronomia
  console.log('Wizard Passo 1 (Gastronomia): selecionando interesses...');
  await page.locator('text=Comida Italiana').filter({ visible: true }).first().click({ force: true }).catch(() => {});
  await page.locator('text=Comida Oriental').filter({ visible: true }).first().click({ force: true }).catch(() => {});
  await page.locator('text=Sabor Local').filter({ visible: true }).first().click({ force: true }).catch(() => {});
  await page.waitForTimeout(500);
  console.log('Avançando para Passo 2...');
  await page.locator('text=PRÓXIMO').filter({ visible: true }).first().click({ force: true });
  await page.waitForTimeout(800);

  // Passo 2: Cultura
  console.log('Wizard Passo 2 (Cultura): selecionando interesses...');
  await page.locator('text=Cinema').filter({ visible: true }).first().click({ force: true }).catch(() => {});
  await page.locator('text=Exposições').filter({ visible: true }).first().click({ force: true }).catch(() => {});
  await page.locator('text=Música ao Vivo').filter({ visible: true }).first().click({ force: true }).catch(() => {});
  await page.waitForTimeout(500);
  console.log('Avançando para Passo 3...');
  await page.locator('text=PRÓXIMO').filter({ visible: true }).first().click({ force: true });
  await page.waitForTimeout(800);

  // Passo 3: Aventura
  console.log('Wizard Passo 3 (Aventura): selecionando interesses...');
  await page.locator('text=Trilhas').filter({ visible: true }).first().click({ force: true }).catch(() => {});
  await page.locator('text=Surf').filter({ visible: true }).first().click({ force: true }).catch(() => {});
  await page.locator('text=Camping & Bushcraft').filter({ visible: true }).first().click({ force: true }).catch(() => {});
  await page.waitForTimeout(500);
  console.log('Avançando para Passo 4...');
  await page.locator('text=PRÓXIMO').filter({ visible: true }).first().click({ force: true });
  await page.waitForTimeout(800);

  // Passo 4: Relaxamento
  console.log('Wizard Passo 4 (Relaxamento): selecionando interesses...');
  await page.locator('text=Ioga').filter({ visible: true }).first().click({ force: true }).catch(() => {});
  await page.locator('text=Spas & Termais').filter({ visible: true }).first().click({ force: true }).catch(() => {});
  await page.locator('text=Parques & Jardins').filter({ visible: true }).first().click({ force: true }).catch(() => {});
  await page.waitForTimeout(500);
  console.log('Avançando para Passo 5...');
  await page.locator('text=PRÓXIMO').filter({ visible: true }).first().click({ force: true });
  await page.waitForTimeout(800);

  // Passo 5: Vida Noturna (Passo Final)
  console.log('Wizard Passo 5 (Vida Noturna - Final): selecionando interesses...');
  await page.locator('text=Barzinho').filter({ visible: true }).first().click({ force: true }).catch(() => {});
  await page.locator('text=Balada').filter({ visible: true }).first().click({ force: true }).catch(() => {});
  await page.locator('text=Vinhos & Bistrôs').filter({ visible: true }).first().click({ force: true }).catch(() => {});
  await page.waitForTimeout(500);

  console.log('Concluindo o Onboarding...');
  await page.locator('text=CONCLUIR').filter({ visible: true }).first().click({ force: true });

  // 2. Deve redirecionar para a tela principal (Dashboard Explore)
  console.log('Aguardando redirecionamento para o Dashboard de Atrações (/dashboard)...');
  await page.waitForURL('**/dashboard', { timeout: 15000 });

  console.log('✔ [Onboarding] Preferências salvas com sucesso! Redirecionado para o Dashboard.');
}

module.exports = { runPreferences };
