// @ts-check
import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Obtener __dirname en un módulo ES, ya que no está disponible de forma global.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Lee el fichero .env.testing del backend para obtener el puerto de la API.
dotenv.config({ path: path.resolve(__dirname, '..', 'backend', '.env.testing') });
const API_HOST = process.env.HOST || 'localhost';
const API_PORT = process.env.PORT || 3001;

// Lee el fichero .env.testing del frontend para obtener el puerto de la UI.
dotenv.config({ path: path.resolve(__dirname, '.env.testing') });
const FRONTEND_HOST = process.env.VITE_HOST || 'localhost';
const FRONTEND_PORT = parseInt(process.env.VITE_PORT || '5173', 10);

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  globalSetup: './playwright.global-setup.js',
  testDir: './tests/e2e',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'list',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: `http://${FRONTEND_HOST}:${FRONTEND_PORT}`,

    // URL base para las peticiones de API directas con `request`.
    apiURL: `http://${API_HOST}:${API_PORT}/api/`,

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  /* Run your local dev server before starting the tests */
  webServer: [
    {
      // 1. Arranca el servidor del backend en modo test.
      command: 'pnpm start:test',
      // 3. Especificamos el directorio del backend para que pnpm funcione.
      cwd: path.resolve(__dirname, '..', 'backend'),
      // 2. Playwright esperará hasta que esta URL responda correctamente.
      url: `http://${API_HOST}:${API_PORT}/health`,
      reuseExistingServer: !process.env.CI,
      // Capturamos la salida estándar y de error para depurar por qué el proceso se cierra.
      stdout: 'pipe',
      stderr: 'pipe',
    },
    {
      command: 'pnpm --filter frontend dev:testing',
      port: FRONTEND_PORT,
      reuseExistingServer: !process.env.CI,
    }
  ]
});
