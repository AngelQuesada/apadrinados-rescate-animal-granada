// @ts-check
import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  test.setTimeout(120000);
  await page.goto('http://localhost:5173');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/RAG - Adopciones/);
});
