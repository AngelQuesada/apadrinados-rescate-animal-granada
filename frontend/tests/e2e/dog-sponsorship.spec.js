import { test, expect } from '@playwright/test';

test.describe('Dog Sponsorship', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
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
    const dogCard = page.locator('[data-testid="dog-card"]').first();
    const copyButton = dogCard.locator('[data-testid="copy-emails-button"]');
    await copyButton.click();
    const snackbar = page.locator('.MuiSnackbar-root');
    await expect(snackbar).toBeVisible();
    await expect(snackbar).toContainText('Emails copiados al portapapeles');
  });

  test('should manage sponsors in a dog profile', async ({ page }) => {
    const dogCard = page.locator('[data-testid="dog-card"]').first();
    await dogCard.locator('[data-testid="view-profile-button"]').click();

    await page.waitForURL(/\/dog-profile\/\d+/);

    const sponsorName = `Sponsor ${Date.now()}`;
    const sponsorEmail = `sponsor-${Date.now()}@example.com`;
    const updatedSponsorName = `Updated Sponsor ${Date.now()}`;

    // Add a sponsor
    await page.getByTestId('add-sponsor-button').click();
    const sponsorForm = page.locator('form');
    await sponsorForm.locator('input[name="name"]').fill(sponsorName);
    await sponsorForm.locator('input[name="email"]').fill(sponsorEmail);
    await sponsorForm.locator('button[type="submit"]').click();
    await expect(page.getByText(sponsorName)).toBeVisible();

    // Edit the sponsor
    const sponsorRow = page.locator(`tr:has-text("${sponsorName}")`);
    await sponsorRow.locator('[data-testid="edit-sponsor-button"]').click();
    const editSponsorForm = page.locator('form');
    await editSponsorForm.locator('input[name="name"]').fill(updatedSponsorName);
    await editSponsorForm.locator('button[type="submit"]').click();
    await expect(page.getByText(updatedSponsorName)).toBeVisible();

    // Remove the sponsor
    const updatedSponsorRow = page.locator(`tr:has-text("${updatedSponsorName}")`);
    await updatedSponsorRow.locator('[data-testid="delete-sponsor-button"]').click();
    await page.getByTestId('confirm-dialog-accept-button').click();
    await expect(page.getByText(updatedSponsorName)).not.toBeVisible();
  });

  test('should remove 2 or more sponsors', async ({ page }) => {
    const dogCard = page.locator('[data-testid="dog-card"]').first();
    await dogCard.locator('[data-testid="view-profile-button"]').click();
    await page.waitForURL(/\/dog-profile\/\d+/);

    const sponsor1Name = `Sponsor 1 ${Date.now()}`;
    const sponsor1Email = `sponsor1-${Date.now()}@example.com`;
    const sponsor2Name = `Sponsor 2 ${Date.now()}`;
    const sponsor2Email = `sponsor2-${Date.now()}@example.com`;

    // Add two sponsors
    const addSponsorButton = page.getByTestId('add-sponsor-button');
    await addSponsorButton.click();
    const sponsorForm = page.locator('form');
    await sponsorForm.locator('input[name="name"]').fill(sponsor1Name);
    await sponsorForm.locator('input[name="email"]').fill(sponsor1Email);
    await sponsorForm.locator('button[type="submit"]').click();

    await addSponsorButton.click();
    await sponsorForm.locator('input[name="name"]').fill(sponsor2Name);
    await sponsorForm.locator('input[name="email"]').fill(sponsor2Email);
    await sponsorForm.locator('button[type="submit"]').click();

    // Select and delete
    const sponsor1Row = page.locator(`tr:has-text("${sponsor1Name}")`);
    const sponsor2Row = page.locator(`tr:has-text("${sponsor2Name}")`);
    await sponsor1Row.locator('input[type="checkbox"]').check();
    await sponsor2Row.locator('input[type="checkbox"]').check();

    const deleteSelectedButton = page.getByTitle('Eliminar seleccionados');
    await deleteSelectedButton.click();

    await page.getByTestId('confirm-dialog-accept-button').click();

    await expect(page.getByText(sponsor1Name)).not.toBeVisible();
    await expect(page.getByText(sponsor2Name)).not.toBeVisible();
  });

  test('should copy emails from the dog profile page', async ({ page }) => {
    const dogCard = page.locator('[data-testid="dog-card"]').first();
    await dogCard.locator('[data-testid="view-profile-button"]').click();
    await page.waitForURL(/\/dog-profile\/\d+/);

    const copyButton = page.getByTitle('Copiar emails');
    await copyButton.click();

    const snackbar = page.locator('.MuiSnackbar-root');
    await expect(snackbar).toBeVisible();
    await expect(snackbar).toContainText('Emails de los padrinos copiados al portapapeles');
  });
});
