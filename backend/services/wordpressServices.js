import config from "../config/index.js";
import AppError from "../utils/AppError.js";

const fetchAllDogs = async () => {
  const sqlQuery = `
    SELECT 
        p.ID AS id,
        p.post_title, 
        p.post_modified, 
        p.post_status, 
        a.guid AS featured_image_url,
        COALESCE(pm2.meta_value, 'false') AS id_suscripcion_paypal
    FROM 
        wp_posts p
    LEFT JOIN 
        wp_postmeta pm ON p.ID = pm.post_id AND pm.meta_key = '_thumbnail_id'
    LEFT JOIN 
        wp_posts a ON pm.meta_value = a.ID
    LEFT JOIN 
        wp_postmeta pm2 ON p.ID = pm2.post_id AND pm2.meta_key = 'id_suscripcion_paypal'
    WHERE 
        p.post_type = 'portfolio' AND p.post_status IN ('publish', 'private')
  `;

  try {
    const [rows] = await config.db.query(sqlQuery);
    return rows;
  } catch (error) {
    console.error("Error al consultar la base de datos:", error);
    throw new AppError(
      "Error en la capa de servicio al obtener los datos de los perros.",
      500
    );
  }
};

const fetchSponsorsByDogsIds = async (dogs_ids) => {
  const query = `SELECT
    ds.dog_id,
    ds.sponsor_id,
    ds.id AS dog_sponsor_id,
    s.name,
    s.email,
    ds.is_active,
    ds.created_at,
    ds.source,
    pm.meta_value AS id_suscripcion_paypal
FROM
    wp_custom_dog_sponsors ds
JOIN
    wp_custom_sponsors s ON ds.sponsor_id = s.id
LEFT JOIN
    wp_postmeta pm ON ds.dog_id = pm.post_id AND pm.meta_key = 'id_suscripcion_paypal'
WHERE
    ds.dog_id IN (?)`;
  try {
    const [rows] = await config.db.query(query, [dogs_ids]);
    return rows;
  } catch (error) {
    console.error(
      "Error al obtener los sponsors por perros en el service:",
      error
    );
    throw new AppError(
      "Error en la capa de servicio al obtener los sponsors por perros.",
      500
    );
  }
};

const saveSponsors = async (sponsors) => {
  if (!sponsors || sponsors.length === 0) {
    throw new AppError(
      "No se proporcionaron patrocinadores para guardar.",
      500
    );
  }

  let sqlQuery = `
    INSERT INTO wp_custom_sponsors (name, email, created_at, updated_at)
    VALUES 
  `;

  const placeholders = sponsors.map(() => "(?, ?, NOW(), NOW())").join(", ");

  const values = sponsors.flatMap((sponsor) => [sponsor.name, sponsor.email]);

  try {
    await config.db.query(sqlQuery + placeholders, values);
    console.log(`${sponsors.length} patrocinadores guardados exitosamente.`);
  } catch (error) {
    console.error("Error al guardar los patrocinadores:", error);
    throw new AppError(
      "Error en la capa de servicio al guardar los patrocinadores.",
      500
    );
  }
};

const saveSponsor = async ({ name, email }) => {
  if (!email) {
    throw new AppError("No se proporcionó un email.", 500);
  }
  if (!name) {
    throw new AppError("No se proporcionó un nombre.", 500);
  }

  let sqlQuery = `
    INSERT INTO wp_custom_sponsors (name, email, created_at, updated_at)
    VALUES (?, ?, NOW(), NOW())
  `;

  const values = [name, email];

  try {
    return config.db.query(sqlQuery, values);
  } catch (error) {
    console.error("Error al guardar el nuevo padrino:", error);
    throw new AppError(
      "Error en la capa de servicio al guardar un padrino.",
      500
    );
  }
};

const saveDogSponsor = async ({
  dog_id,
  sponsor_id,
  end_date,
  source,
  is_active,
}) => {
  const sqlQuery = `
    INSERT INTO wp_custom_dog_sponsors (dog_id, sponsor_id, end_date, source, is_active, start_date, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, NOW(), NOW(), NOW())
  `;
  try {
    return await config.db.query(sqlQuery, [
      dog_id,
      sponsor_id,
      end_date,
      source,
      is_active,
    ]);
  } catch (error) {
    console.error("Error al guardar la relación padrino-perro:", error);
    throw new AppError(
      "Error en la capa de servicio al guardar la relación padrino-perro.",
      500
    );
  }
};

const deleteDogSponsor = async ({ dogSponsorId }) => {
  const sqlQuery = `
    DELETE FROM wp_custom_dog_sponsors where id = ?
  `;
  try {
    return await config.db.query(sqlQuery, [dogSponsorId]);
  } catch (error) {
    console.error("Error al borrar la relación padrino-perro:", error);
    throw new AppError(
      "Error en la capa de servicio al borrar la relación padrino-perro.",
      500
    );
  }
};

const getAllSponsors = async () => {
  const query = `
    SELECT 
      id, 
      name, 
      email, 
      created_at, 
      updated_at 
    FROM 
      wp_custom_sponsors
  `;

  try {
    const [rows] = await config.db.query(query);
    return rows;
  } catch (error) {
    console.error("Error al obtener todos los sponsors en el service:", error);
    throw new AppError(
      "Error en la capa de servicio al obtener todos los sponsors.",
      500
    );
  }
};

export default {
  fetchAllDogs,
  saveSponsors,
  saveSponsor,
  saveDogSponsor,
  fetchSponsorsByDogsIds,
  deleteDogSponsor,
  getAllSponsors,
};
