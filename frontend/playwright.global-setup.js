import { spawnSync } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const FRONTEND_HOST = process.env.VITE_HOST || 'localhost';
const FRONTEND_PORT = parseInt(process.env.VITE_PORT || '5173', 10);

async function globalSetup() {
  // Las variables de entorno (incluida DB_NAME) ya han sido cargadas
  // por el fichero playwright.config.js
  const dbName = process.env.DB_NAME || 'No especificada';
  const host = process.env.HOST || 'localhost';

  // El backend escribe el puerto que está usando en un fichero .port.
  // Lo leemos aquí para mostrar el dato real en el log.
  const portFilePath = path.resolve(__dirname, '../backend/.port');
  let realPort = 'No detectado (el servidor backend aún no ha arrancado).';
  if (fs.existsSync(portFilePath)) {
    realPort = fs.readFileSync(portFilePath, 'utf8');
  }

  console.log('================================================================');
  console.log('            🚀  Iniciando entorno de pruebas E2E  🚀            ');
  console.log('================================================================');
  console.log('🔎  Configuración REAL leída desde backend/.env.testing:');
  console.log(`  - Backend DB Name:          ${dbName}`);
  console.log(`  - Backend Host (usado):     ${host}`);
  console.log(`  - Backend Port (real):      ${realPort !== 'No detectado (el servidor backend aún no ha arrancado).' ? realPort : '(aún no asignado)'}`);
  console.log(`  - Playwright API URL (usada): http://${host}:${realPort}`);
  console.log(`  - Frontend URL (usada):     http://${FRONTEND_HOST}:${FRONTEND_PORT}`);
  console.log('----------------------------------------------------------------');

  console.log('🔄  Reseteando la base de datos de pruebas...');

  const command = 'pnpm';
  const args = ['run', 'db:reset:test'];
  const backendDir = path.resolve(__dirname, '../backend');

  const result = spawnSync(command, args, { cwd: backendDir, stdio: 'inherit', shell: true });

  if (result.status !== 0) {
    console.error('❌ Error al resetear la base de datos. Abortando.');
    process.exit(1);
  }

  console.log('✅  Base de datos de pruebas reseteada con éxito.');
}

export default globalSetup;