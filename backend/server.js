import app from "./app.js";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const port = parseInt(process.env.PORT || "3000", 10);
const host = process.env.HOST || 'localhost';

async function startServer() {
  try {
    // Escribimos el puerto (ahora estático) en un fichero para que otros procesos puedan leerlo.
    const portFilePath = path.join(__dirname, '.port');
    fs.writeFileSync(portFilePath, port.toString());

    // Envolvemos app.listen en una promesa para manejar el éxito y los errores.
    await new Promise((resolve, reject) => {
      const server = app.listen(port, host, () => {
        console.log(`✅ Servidor corriendo en el puerto ${port}`);
        resolve();
      });

      server.on('error', (error) => {
        console.error("❌ Error al iniciar el servidor (app.listen):", error);
        reject(error);
      });
    });
  } catch (error) {
    console.error("❌ Falló el proceso de arranque del servidor:", error);
    process.exit(1);
  }
}

startServer();