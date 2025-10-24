// Las variables de entorno son cargadas por el comando 'dotenv-cli' que ejecuta este script.
// Este script solo reporta las variables que ya existen en el proceso.

console.log("Fichero de entorno especificado:", process.env.DOTENV_CONFIG_PATH ?? "No especificado (reporte no fiable en este sistema)");
console.log("--- Verificación de Variables ---");
console.log("PORT:", process.env.PORT);
console.log("DB_NAME:", process.env.DB_NAME);
