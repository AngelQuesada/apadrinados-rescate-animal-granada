import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { getDbConnection } from "#db/db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function seedDatabase() {
  let connection;
  console.log("🚀 Iniciando el script de seeding...");

  try {
    connection = await getDbConnection();
    console.log("✅ Conexión a la base de datos establecida.");
    const sponsorsPath = path.resolve(__dirname, "../mocks/sponsors.json");
    const dogSponsorsPath = path.resolve(
      __dirname,
      "../mocks/dog_sponsors.json"
    );

    const sponsorsData = JSON.parse(await fs.readFile(sponsorsPath, "utf-8"));
    const dogSponsorsData = JSON.parse(
      await fs.readFile(dogSponsorsPath, "utf-8")
    );
    console.dir("sponsorsData" + sponsorsData);
    console.dir("dogSponsorsData" + dogSponsorsData);
    console.log("✅ Datos mock leídos correctamente.");

    console.log("⏳ Vaciando tablas existentes...");
    await connection.query("SET FOREIGN_KEY_CHECKS = 0;");
    await connection.query("TRUNCATE TABLE wp_custom_sponsors");
    await connection.query("TRUNCATE TABLE wp_custom_dog_sponsors");
    await connection.query("SET FOREIGN_KEY_CHECKS = 1;");
    console.log("✅ Tablas vaciadas correctamente.");
    console.log("⏳ Insertando datos mock...");
    const sponsors = sponsorsData.sponsors.map((sponsor) => [
      sponsor.id,
      sponsor.name,
      sponsor.email,
      new Date(),
      new Date(),
    ]);

    await connection.query(
      "INSERT INTO wp_custom_sponsors (id, name, email, created_at, updated_at) VALUES ?",
      [sponsors]
    );
    console.log("✅ Datos de padrinos insertados correctamente.");
    const dogSponsors = dogSponsorsData.dog_sponsors.map((dogSponsor) => [
      dogSponsor.id,
      dogSponsor.dog_id,
      dogSponsor.sponsor_id,
      dogSponsor.start_date,
      dogSponsor.end_date,
      // new Date(),
      // new Date(),
      dogSponsor.source,
      dogSponsor.is_active,
    ]);
    await connection.query(
      "INSERT INTO wp_custom_dog_sponsors (id, dog_id, sponsor_id, start_date, end_date, source, is_active) VALUES ?",
      [dogSponsors]
    );
    console.log("✅ Datos relación padrino-perro insertados correctamente.");
    console.log("✅ Script de seeding completado.");
  } catch (error) {
    console.error("Error al insertar datos mock:", error);
    throw error;
  }
}

await seedDatabase();
