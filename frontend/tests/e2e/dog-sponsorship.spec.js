import { test, expect } from '@playwright/test';

test.describe('Dog Sponsorship', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should open and close "Sin apadrinar" and "No disponibles" tabs', async ({ page }) => {
    // Check "Sin apadrinar" section
    const sinApadrinarTitle = page.getByText('Sin apadrinar');
    await sinApadrinarTitle.click();
    await expect(page.locator('text=Cargar perros sin apadrinar')).toBeVisible();
    await sinApadrinarTitle.click();
    await expect(page.locator('text=Cargar perros sin apadrinar')).not.toBeVisible();

    // Check "No disponibles" section
    const noDisponiblesTitle = page.getByText('No disponibles');
    await noDisponiblesTitle.click();
    await expect(page.locator('text=Cargar perros no disponibles')).toBeVisible();
    await noDisponiblesTitle.click();
    await expect(page.locator('text=Cargar perros no disponibles')).not.toBeVisible();
  });

  test('should copy all emails from one dog on the front page', async ({ page }) => {
    const dogCard = page.locator('[data-testid="dog-card"]').first();
    const copyButton = dogCard.locator('button[aria-label="Copiar correos de los padrinos"]');
    await copyButton.click();
    const snackbar = page.locator('.MuiSnackbar-root');
    await expect(snackbar).toBeVisible();
    await expect(snackbar).toContainText('Emails de los padrinos copiados al portapapeles');
  });

  test('should go into a dog profile', async ({ page }) => {
    const dogCard = page.locator('[data-testid="dog-card"]').first();
    await dogCard.click();
    await expect(page).toHaveURL(/\/dog-profile\/\d+/);
  });

  test('should add a sponsor', async ({ page }) => {
    const dogCard = page.locator('[data-testid="dog-card"]').first();
    await dogCard.click();

    const addSponsorButton = page.getByText('Añadir Padrino');
    await addSponsorButton.click();

    const sponsorForm = page.locator('form');
    await sponsorForm.locator('input[name="name"]').fill('John Doe');
    await sponsorForm.locator('input[name="email"]').fill('john.doe@example.com');
    await sponsorForm.locator('button[type="submit"]').click();

    await expect(page.getByText('John Doe')).toBeVisible();
  });

  test('should remove a sponsor', async ({ page }) => {
    const dogCard = page.locator('[data-testid="dog-card"]').first();
    await dogCard.click();

    // Add a sponsor to be removed
    const addSponsorButton = page.getByText('Añadir Padrino');
    await addSponsorButton.click();
    const sponsorForm = page.locator('form');
    await sponsorForm.locator('input[name="name"]').fill('Sponsor To Remove');
    await sponsorForm.locator('input[name="email"]').fill('remove@example.com');
    await sponsorForm.locator('button[type="submit"]').click();

    const sponsorRow = page.locator('tr:has-text("Sponsor To Remove")');
    const deleteButton = sponsorRow.locator('button[aria-label="delete"]');
    await deleteButton.click();

    const confirmButton = page.getByText('Confirmar');
    await confirmButton.click();

    await expect(page.getByText('Sponsor To Remove')).not.toBeVisible();
  });

  test('should edit a sponsor', async ({ page }) => {
    const dogCard = page.locator('[data-testid="dog-card"]').first();
    await dogCard.click();

    // Add a sponsor to be edited
    const addSponsorButton = page.getByText('Añadir Padrino');
    await addSponsorButton.click();
    const sponsorForm = page.locator('form');
    await sponsorForm.locator('input[name="name"]').fill('Sponsor To Edit');
    await sponsorForm.locator('input[name="email"]').fill('edit@example.com');
    await sponsorForm.locator('button[type="submit"]').click();

    const sponsorRow = page.locator('tr:has-text("Sponsor To Edit")');
    const editButton = sponsorRow.locator('button[aria-label="edit"]');
    await editButton.click();

    const editSponsorForm = page.locator('form');
    await editSponsorForm.locator('input[name="name"]').fill('Edited Sponsor');
    await editSponsorForm.locator('button[type="submit"]').click();

    await expect(page.getByText('Edited Sponsor')).toBeVisible();
  });

  test('should remove 2 or more sponsors', async ({ page }) => {
    const dogCard = page.locator('[data-testid="dog-card"]').first();
    await dogCard.click();

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

    const deleteSelectedButton = page.getByText('Borrar seleccionados');
    await deleteSelectedButton.click();

    const confirmButton = page.getByText('Confirmar');
    await confirmButton.click();

    await expect(page.getByText('Sponsor 1')).not.toBeVisible();
    await expect(page.getByText('Sponsor 2')).not.toBeVisible();
  });

  test('should copy all emails from dog profile', async ({ page }) => {
    const dogCard = page.locator('[data-testid="dog-card"]').first();
    await dogCard.click();

    const copyButton = page.getByText('Copiar Correos');
    await copyButton.click();

    const snackbar = page.locator('.MuiSnackbar-root');
    await expect(snackbar).toBeVisible();
    await expect(snackbar).toContainText('Emails de los padrinos copiados al portapapeles');
  });
});
