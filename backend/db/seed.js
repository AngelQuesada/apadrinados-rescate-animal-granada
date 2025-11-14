import knex from "knex";
import { readFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import config from "../knexfile.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function readMockData(fileName) {
  const filePath = path.resolve(__dirname, "..", "mocks", fileName);
  const data = await readFile(filePath, "utf8");
  return JSON.parse(data);
}

export async function seedDatabase() {
  const environment = process.env.NODE_ENV || "development";
  console.log(
    `🚀 Iniciando el script de seeding para el entorno: ${environment}...`
  );
  const db = knex(config[environment]);

  try {
    console.log("✅ Conexión a la base de datos establecida con Knex.");

    const sponsors = await readMockData("sponsors.json");
    const dog_sponsors = await readMockData("dog_sponsors.json");
    console.log("✅ Datos mock leídos correctamente.");

    await db.transaction(async (trx) => {
      await trx.raw("SET FOREIGN_KEY_CHECKS = 0;");
      console.log("🔑 Foreign key checks deshabilitadas.");

      await trx("wp_custom_dog_sponsors").truncate();
      console.log("🗑️ Tabla wp_custom_dog_sponsors vaciada.");
      await trx("wp_custom_sponsors").truncate();
      console.log("🗑️ Tabla wp_custom_sponsors vaciada.");

      await trx("wp_custom_sponsors").insert(sponsors.sponsors);
      console.log(
        `✅ Insertados ${sponsors.sponsors.length} registros en wp_custom_sponsors.`
      );
      await trx("wp_custom_dog_sponsors").insert(dog_sponsors.dog_sponsors);
      console.log(
        `✅ Insertados ${dog_sponsors.dog_sponsors.length} registros en wp_custom_dog_sponsors.`
      );

      await trx.raw("SET FOREIGN_KEY_CHECKS = 1;");
      console.log("🔑 Foreign key checks rehabilitadas.");
    });

    console.log("✅ Script de seeding completado con éxito.");
  } catch (error) {
    console.error("❌ Error durante el script de seeding:", error);
    throw error;
  } finally {
    if (db) {
      await db.destroy();
      console.log("🔌 Conexión a la base de datos cerrada.");
    }
  }
}

seedDatabase().catch(() => {
  process.exit(1);
});
