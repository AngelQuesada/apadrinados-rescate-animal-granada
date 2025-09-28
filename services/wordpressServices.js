import config from "../config/index.js";

const fetchAllDogs = async () => {
  const sqlQuery = `
    SELECT 
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
    throw new Error(
      "Error en la capa de servicio al obtener los datos de los perros."
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
        ds.created_at
      FROM wp_custom_dog_sponsors ds
      JOIN wp_custom_sponsors s ON ds.sponsor_id = s.id
      WHERE ds.dog_id IN (?);`;
  try {
    const [rows] = await config.db.query(query, [dogs_ids]);
    return rows;
  } catch (error) {
    console.error(
      "Error al obtener los sponsors por perros en el service:",
      error
    );
    throw new Error(
      "Error en la capa de servicio al obtener los sponsors por perros."
    );
  }
};

const saveSponsor = async (name, email) => {
  const sqlQuery = `
    INSERT INTO wp_custom_sponsors (name, email, created_at, updated_at)
    VALUES (?,?,NOW(),NOW())
  `;
  try {
    await config.db.query(sqlQuery, [name, email]);
  } catch (error) {
    console.error("Error al guardar la suscripción:", error);
    throw new Error("Error en la capa de servicio al guardar la suscripción.");
  }
};

const saveDogSponsor = async (
  dog_id,
  sponsor_id,
  start_date,
  end_date,
  source,
  is_active
) => {
  // Source = {
  //   0: custom;
  //   1: paypal;
  // }
  const sqlQuery = `
    INSERT INTO wp_custom_dog_sponsors (dog_id, sponsor_id, start_date, end_date, source, is_active, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())
  `;
  try {
    await config.db.query(sqlQuery, [
      dog_id,
      sponsor_id,
      start_date,
      end_date,
      source,
      is_active,
    ]);
  } catch (error) {
    console.error("Error al guardar la relación padrino-perro:", error);
    throw new Error(
      "Error en la capa de servicio al guardar la relación padrino-perro."
    );
  }
};

export default {
  fetchAllDogs,
  saveSponsor,
  saveDogSponsor,
  fetchSponsorsByDogsIds,
};
