const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// El script está en /scripts, así que el root del proyecto está un nivel arriba.
const projectRoot = path.join(__dirname, '..');

const rootNodeModules = path.join(projectRoot, 'node_modules');
const backendNodeModules = path.join(projectRoot, 'backend', 'node_modules');
const frontendNodeModules = path.join(projectRoot, 'frontend', 'node_modules');

const pathsToRemove = [rootNodeModules, backendNodeModules, frontendNodeModules];

const removeDir = (dirPath) => {
  // Usamos stat para verificar si es un directorio, para más seguridad.
  try {
    if (fs.statSync(dirPath).isDirectory()) {
      console.log(`Eliminando directorio: ${dirPath}...`);
      fs.rmSync(dirPath, { recursive: true, force: true });
      console.log(`Directorio '${path.basename(dirPath)}' en '${path.dirname(dirPath)}' eliminado con éxito.`);
    }
  } catch (error) {
    if (error.code === 'ENOENT') {
      // ENOENT significa "Error NO ENTry", es decir, el archivo o directorio no existe.
      console.log(`El directorio '${path.basename(dirPath)}' en '${path.dirname(dirPath)}' no existe, no se necesita ninguna acción.`);
    } else {
      // Si es otro tipo de error (ej. permisos), lo mostramos.
      console.error(`Error al eliminar el directorio ${dirPath}:`, error);
    }
  }
};

console.log('Iniciando la reinstalación de dependencias...');

pathsToRemove.forEach(removeDir);

try {
  console.log('Ejecutando "pnpm install" desde la raíz del proyecto...');
  // Se usa { stdio: 'inherit' } para que el output de pnpm se vea en tiempo real.
  execSync('pnpm install', { stdio: 'inherit' });
  console.log('¡Dependencias instaladas correctamente!');
} catch (error) {
  console.error('Error durante la ejecución de "pnpm install":', error);
  process.exit(1);
}
