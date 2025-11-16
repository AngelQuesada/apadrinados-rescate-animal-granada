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

  test('should navigate to dog profile and manage sponsors', async ({ page, testingSponsors }) => {
    const { 
      name:sponsorName, 
      email:sponsorEmail, 
      editedName:updatedSponsorName, 
    } = testingSponsors[0]
    
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

  test('should remove 2 or more sponsors', async ({ page, testingSponsors }) => {
    const dogCard = page.locator('[data-testid="dog-card"]').first();
    await dogCard.locator('[data-testid="view-profile-button"]').click();
    await page.waitForURL(/\/dog-profile\/\d+/);

    // Añadimos dos sponsors
    const addSponsorButton = page.getByTestId('add-sponsor-button');
    await addSponsorButton.click();
    const sponsorForm = page.locator('form');
    const sponsorTable = page.getByTestId('sponsor-table');

    await sponsorForm.locator('input[name="name"]').fill(testingSponsors[0].name);
    await sponsorForm.locator('input[name="email"]').fill(testingSponsors[0].email);
    await sponsorForm.locator('button[type="submit"]').click();
    await expect(sponsorTable).toContainText(testingSponsors[0].name);

    await addSponsorButton.click();
    await sponsorForm.locator('input[name="name"]').fill(testingSponsors[1].name);
    await sponsorForm.locator('input[name="email"]').fill(testingSponsors[1].email);
    await sponsorForm.locator('button[type="submit"]').click();
    await expect(sponsorTable).toContainText(testingSponsors[1].name);

    // Los selecccionamos con sus checkboxes
    const sponsor1Row = page.locator(`tr:has-text("${testingSponsors[0].name}")`);
    const sponsor2Row = page.locator(`tr:has-text("${testingSponsors[1].name}")`);
    await sponsor1Row.locator('input[type="checkbox"]').click();
    await sponsor2Row.locator('input[type="checkbox"]').click();

    // Los borramos
    const deleteSelectedButton = page.getByTestId('delete-selected-button');
    await deleteSelectedButton.click();

    await page.getByTestId('confirm-dialog-accept-button').click();

    // Comprobamos que ya no están en la tabla
    await expect(sponsorTable.getByText(testingSponsors[0].name)).not.toBeVisible();
    await expect(sponsorTable.getByText(testingSponsors[1].name)).not.toBeVisible();
  });

  test('should copy emails from the dog profile page', async ({ page }) => {
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

    const dogCard = page.locator('[data-testid="dog-card"]').first();
    await dogCard.locator('[data-testid="view-profile-button"]').click();
    await page.waitForURL(/\/dog-profile\/\d+/);

    const copyButton = page.getByTestId('copy-emails-button');
    await copyButton.click();

    const snackbar = page.locator('.MuiSnackbar-root');
    await expect(snackbar).toBeVisible();
    await expect(snackbar).toContainText('Emails copiados al portapapeles');
  });
});
