// playwright.global-setup.js
import { execSync } from 'child_process';
import path from 'path';

async function globalSetup() {
  console.log('Resetting test database...');
  const backendDir = path.resolve(process.cwd(), '../backend');

  try {
    execSync('pnpm run db:reset:test', {
      cwd: backendDir,
      stdio: 'inherit',
    });
    console.log('Test database reset successfully.');
  } catch (error) {
    console.error('Failed to reset test database:', error);
    process.exit(1);
  }
}

export default globalSetup;
