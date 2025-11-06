import { test, expect } from '@playwright/test';

test.describe('Dog Sponsorship', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should open and close "Sin apadrinar" and "No disponibles" tabs', async ({ page }) => {
    // Check "Sin apadrinar" section
    const sinApadrinarTitle = page.getByText('Sin apadrinar');
    await sinApadrinarTitle.click();
    await expect(page.locator('[data-testid="dog-card"]').first()).toBeVisible();
    await sinApadrinarTitle.click();
    await expect(page.locator('[data-testid="dog-card"]').first()).not.toBeVisible();

    // Check "No disponibles" section
    const noDisponiblesTitle = page.getByText('No disponibles');
    await noDisponiblesTitle.click();
    await expect(page.locator('[data-testid="dog-card"]').first()).toBeVisible();
    await noDisponiblesTitle.click();
    await expect(page.locator('[data-testid="dog-card"]').first()).not.toBeVisible();
  });

  test('should copy all emails from one dog on the front page', async ({ page }) => {
    const dogCard = page.locator('[data-testid="dog-card"]').first();
    const copyButton = dogCard.locator('[data-testid="copy-emails-button"]');
    await copyButton.click();
    const snackbar = page.locator('.MuiSnackbar-root');
    await expect(snackbar).toBeVisible();
    await expect(snackbar).toContainText('Emails de los padrinos copiados al portapapeles');
  });

  test('should go into a dog profile and manage sponsors', async ({ page }) => {
    const dogCard = page.locator('[data-testid="dog-card"]').first();
    const viewProfileButton = dogCard.locator('[data-testid="view-profile-button"]');
    await viewProfileButton.click();

    await page.waitForURL(/\/dog-profile\/\d+/);
    await expect(page).toHaveURL(/\/dog-profile\/\d+/);

    // Add a sponsor
    const addSponsorButton = page.getByText('Añadir Padrino');
    await addSponsorButton.click();
    const sponsorForm = page.locator('form');
    await sponsorForm.locator('input[name="name"]').fill('John Doe');
    await sponsorForm.locator('input[name="email"]').fill('john.doe@example.com');
    await sponsorForm.locator('button[type="submit"]').click();
    await expect(page.getByText('John Doe')).toBeVisible();

    // Edit the sponsor
    const sponsorRow = page.locator('tr:has-text("John Doe")');
    const editButton = sponsorRow.locator('button[aria-label="edit"]');
    await editButton.click();
    const editSponsorForm = page.locator('form');
    await editSponsorForm.locator('input[name="name"]').fill('Jane Doe');
    await editSponsorForm.locator('button[type="submit"]').click();
    await expect(page.getByText('Jane Doe')).toBeVisible();

    // Remove the sponsor
    const updatedSponsorRow = page.locator('tr:has-text("Jane Doe")');
    const deleteButton = updatedSponsorRow.locator('button[aria-label="delete"]');
    await deleteButton.click();
    const confirmButton = page.getByText('Confirmar');
    await confirmButton.click();
    await expect(page.getByText('Jane Doe')).not.toBeVisible();
  });

  test('should remove 2 or more sponsors', async ({ page }) => {
    const dogCard = page.locator('[data-testid="dog-card"]').first();
    const viewProfileButton = dogCard.locator('[data-testid="view-profile-button"]');
    await viewProfileButton.click();
    await page.waitForURL(/\/dog-profile\/\d+/);

    // Add two sponsors to be removed
    const addSponsorButton = page.getByText('Añadir Padrino');
    await addSponsorButton.click();
    const sponsorForm = page.locator('form');
    await sponsorForm.locator('input[name="name"]').fill('Sponsor 1');
    await sponsorForm.locator('input[name="email"]').fill('sponsor1@example.com');
    await sponsorForm.locator('button[type="submit"]').click();
    await addSponsorButton.click();
    await sponsorForm.locator('input[name="name"]').fill('Sponsor 2');
    await sponsorForm.locator('input[name="email"]').fill('sponsor2@example.com');
    await sponsorForm.locator('button[type="submit"]').click();

    const sponsor1Row = page.locator('tr:has-text("Sponsor 1")');
    const sponsor2Row = page.locator('tr:has-text("Sponsor 2")');
    await sponsor1Row.locator('input[type="checkbox"]').check();
    await sponsor2Row.locator('input[type="checkbox"]').check();

    const deleteSelectedButton = page.getByTitle('Eliminar seleccionados');
    await deleteSelectedButton.click();

    const confirmButton = page.getByText('Eliminar');
    await confirmButton.click();

    await expect(page.getByText('Sponsor 1')).not.toBeVisible();
    await expect(page.getByText('Sponsor 2')).not.toBeVisible();
  });

  test('should copy all emails from dog profile', async ({ page }) => {
    const dogCard = page.locator('[data-testid="dog-card"]').first();
    const viewProfileButton = dogCard.locator('[data-testid="view-profile-button"]');
    await viewProfileButton.click();
    await page.waitForURL(/\/dog-profile\/\d+/);

    const copyButton = page.getByTitle('Copiar emails');
    await copyButton.click();

    const snackbar = page.locator('.MuiSnackbar-root');
    await expect(snackbar).toBeVisible();
    await expect(snackbar).toContainText('Emails de los padrinos copiados al portapapeles');
  });
});
