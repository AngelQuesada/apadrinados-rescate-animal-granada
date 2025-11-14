import { test, expect } from './fixtures/fixtures';

test.describe('Dog Sponsorship', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should show some dogs on the front page', async ({ page }) => {
    await expect(page.locator('[data-testid="dog-card"]').first()).toBeVisible();
    const dogCards = await page.locator('[data-testid="dog-card"]').count();
    expect(dogCards).toBeGreaterThan(0);
  });

  test('should open and close "Sin apadrinar" and "No disponibles" sections', async ({ page }) => {
    // Check "Sin apadrinar" section
    const sinApadrinarTitle = page.getByText('Sin apadrinar');
    await sinApadrinarTitle.click();
    const sectionSinApadrinar = page.locator('.collapsible-section').filter({ hasText: 'Sin apadrinar' });
    const sinApadrinarDogsGrid = sectionSinApadrinar.locator('.collapsable-dog-grid');
    await expect(sinApadrinarDogsGrid).toBeVisible();
    await sinApadrinarTitle.click();
    await expect(sinApadrinarDogsGrid).not.toBeVisible();

    // Check "No disponibles" section
    const noDisponiblesTitle = page.getByText('No disponibles');
    await noDisponiblesTitle.click();
    const sectionNoDisponibles = page.locator('.collapsible-section').filter({ hasText: 'No disponibles' });
    const noDisponiblesDogsGrid = sectionNoDisponibles.locator('.collapsable-dog-grid');
    await expect(noDisponiblesDogsGrid).toBeVisible();
    await noDisponiblesTitle.click();
    await expect(noDisponiblesDogsGrid).not.toBeVisible();
  });

  test('should copy emails from a dog on the front page', async ({ page }) => {
    // Mock the clipboard API for headless mode
    await page.evaluate(() => {
      const mockClipboard = {
        writeText: () => Promise.resolve(),
      };
      const mockPermissions = {
        query: () => Promise.resolve({ state: 'granted' }),
      };
      Object.defineProperty(navigator, 'clipboard', {
        value: mockClipboard,
        writable: true,
        configurable: true,
      });
      Object.defineProperty(navigator, 'permissions', {
        value: mockPermissions,
        writable: true,
        configurable: true,
      });
    });

    const copyButton = page.locator('[data-testid="copy-emails-button"]:not([disabled])').first();
    await copyButton.click();
    const snackbar = page.locator('.MuiSnackbar-root');
    await expect(snackbar).toBeVisible();
    await expect(snackbar).toContainText('Emails copiados al portapapeles');
  });

  test('should navigate to dog profile and manage sponsors', async ({ page, testingSponsor }) => {
    const { 
      name:sponsorName, 
      email:sponsorEmail, 
      editedName:updatedSponsorName, 
    } = testingSponsor
    
    // --- NAVEGACIÓN ---
    const dogCard = page.locator('[data-testid="dog-card"]').first();
    await dogCard.locator('[data-testid="view-profile-button"]').click();
    await page.waitForURL(/\/dog-profile\/\d+/);

    // --- AÑADIR SPONSOR ---
    await page.getByTestId('add-sponsor-button').click();
    const sponsorForm = page.locator('form[noValidate]');
    await sponsorForm.locator('input[name="name"]').fill(sponsorName);
    await sponsorForm.locator('input[name="email"]').fill(sponsorEmail);
    await sponsorForm.locator('button[type="submit"]').click();
    await expect(page.getByText(sponsorName)).toBeVisible();

    // --- EDITAR SPONSOR ---
    const sponsorRow = page.locator(`tr:has-text("${sponsorName}")`);
    await sponsorRow.locator('[data-testid="edit-sponsor-button"]').click();
    await page.locator('form[noValidate] input[name="name"]').fill(updatedSponsorName);
    await page.locator('form[noValidate] button[type="submit"]').click();
    await expect(page.getByText(updatedSponsorName)).toBeVisible();

    // --- ELIMINAR RELACIÓN ---
    const updatedSponsorRow = page.locator(`tr:has-text("${updatedSponsorName}")`);
    await updatedSponsorRow.locator('[data-testid="delete-sponsor-button"]').click();
    await page.getByTestId('confirm-dialog-accept-button').click();
    await expect(page.getByText(updatedSponsorName)).not.toBeVisible();
  });

  // test('should remove 2 or more sponsors', async ({ page }) => {
  //   const dogCard = page.locator('[data-testid="dog-card"]').first();
  //   await dogCard.locator('[data-testid="view-profile-button"]').click();
  //   await page.waitForURL(/\/dog-profile\/\d+/);

  //   const sponsor1Name = `Sponsor 1 ${Date.now()}`;
  //   const sponsor1Email = `sponsor1-${Date.now()}@example.com`;
  //   const sponsor2Name = `Sponsor 2 ${Date.now()}`;
  //   const sponsor2Email = `sponsor2-${Date.now()}@example.com`;

  //   // Add two sponsors
  //   const addSponsorButton = page.getByTestId('add-sponsor-button');
  //   await addSponsorButton.click();
  //   const sponsorForm = page.locator('form');
  //   await sponsorForm.locator('input[name="name"]').fill(sponsor1Name);
  //   await sponsorForm.locator('input[name="email"]').fill(sponsor1Email);
  //   await sponsorForm.locator('button[type="submit"]').click();

  //   await addSponsorButton.click();
  //   await sponsorForm.locator('input[name="name"]').fill(sponsor2Name);
  //   await sponsorForm.locator('input[name="email"]').fill(sponsor2Email);
  //   await sponsorForm.locator('button[type="submit"]').click();

  //   // Select and delete
  //   const sponsor1Row = page.locator(`tr:has-text("${sponsor1Name}")`);
  //   const sponsor2Row = page.locator(`tr:has-text("${sponsor2Name}")`);
  //   await sponsor1Row.locator('input[type="checkbox"]').check();
  //   await sponsor2Row.locator('input[type="checkbox"]').check();

  //   const deleteSelectedButton = page.getByTitle('Eliminar seleccionados');
  //   await deleteSelectedButton.click();

  //   await page.getByTestId('confirm-dialog-accept-button').click();

  //   await expect(page.getByText(sponsor1Name)).not.toBeVisible();
  //   await expect(page.getByText(sponsor2Name)).not.toBeVisible();
  // });

  // test('should copy emails from the dog profile page', async ({ page }) => {
  //   const dogCard = page.locator('[data-testid="dog-card"]').first();
  //   await dogCard.locator('[data-testid="view-profile-button"]').click();
  //   await page.waitForURL(/\/dog-profile\/\d+/);

  //   const copyButton = page.getByTitle('Copiar emails');
  //   await copyButton.click();

  //   const snackbar = page.locator('.MuiSnackbar-root');
  //   await expect(snackbar).toBeVisible();
  //   await expect(snackbar).toContainText('Emails de los padrinos copiados al portapapeles');
  // });
});
