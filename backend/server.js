import app from "./app.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import logger from "./utils/logger.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const port = parseInt(process.env.PORT || "3000", 10);
const host = process.env.HOST || "localhost";

async function startServer() {
  try {
    // Startup logs verification
    logger.info("🚀 Iniciando el backend...");
    logger.info(`🔧 Configuración cargada: HOST=${host}, PORT=${port}`);

    // Escribimos el puerto (ahora estático) en un fichero para que otros procesos puedan leerlo.
    const portFilePath = path.join(__dirname, ".port");
    fs.writeFileSync(portFilePath, port.toString());
    logger.info(`📂 Archivo de puerto escrito en: ${portFilePath}`);

    // Envolvemos app.listen en una promesa para manejar el éxito y los errores.
    await new Promise((resolve, reject) => {
      const server = app.listen(port, host, () => {
        logger.info(`✅ Servidor corriendo en el puerto ${port}`);
        resolve();
      });

      server.on("error", (error) => {
        logger.error(
          `❌ Error al iniciar el servidor (app.listen): ${error.message}`
        );
        reject(error);
      });
    });
  } catch (error) {
    logger.error(
      `❌ Falló el proceso de arranque del servidor: ${error.message}`
    );
    process.exit(1);
  }
}

startServer();
