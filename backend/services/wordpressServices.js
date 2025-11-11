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
    const result = await config.db.query(sqlQuery, [
      dog_id,
      sponsor_id,
      end_date,
      source,
      is_active,
    ]);

    await updateDogModifiedDate(dog_id);

    return result;
  } catch (error) {
    console.error("Error al guardar la relación padrino-perro:", error);
    throw new AppError(
      "Error en la capa de servicio al guardar la relación padrino-perro.",
      500
    );
  }
};

const updateSponsor = async ({ id, name, email }) => {
  try {
    const sqlQuery = `
      UPDATE wp_custom_sponsors
      SET name = ?, email = ?, updated_at = NOW()
      WHERE id = ?
    `;
    await config.db.query(sqlQuery, [name, email, id]);

    const getDogIdsQuery = `
      SELECT DISTINCT dog_id FROM wp_custom_dog_sponsors WHERE sponsor_id = ?
    `;
    const [rows] = await config.db.query(getDogIdsQuery, [id]);
    const dogIds = rows.map((row) => row.dog_id);

    await Promise.all(dogIds.map((dogId) => updateDogModifiedDate(dogId)));

    if (dogIds.length > 0) {
      const dogId = dogIds[0];
      const getModifiedDateQuery = `SELECT post_modified FROM wp_posts WHERE ID = ?`;
      const [modifiedDateRows] = await config.db.query(getModifiedDateQuery, [
        dogId,
      ]);
      const newModifiedDate = modifiedDateRows[0].post_modified;
      return { newModifiedDate };
    }

    return { newModifiedDate: null };
  } catch (error) {
    console.error("Error al actualizar el padrino:", error);
    throw new AppError(
      "Error en la capa de servicio al actualizar un padrino.",
      500
    );
  }
};

const deleteDogSponsors = async ({ dogSponsorIds }) => {
  try {
    const getDogIdsQuery = `
      SELECT DISTINCT dog_id FROM wp_custom_dog_sponsors WHERE id IN (?)
    `;
    const [rows] = await config.db.query(getDogIdsQuery, [dogSponsorIds]);
    const dogIds = rows.map((row) => row.dog_id);

    const sqlQuery = `
      DELETE FROM wp_custom_dog_sponsors where id IN (?)
    `;
    await config.db.query(sqlQuery, [dogSponsorIds]);

    await Promise.all(dogIds.map((dogId) => updateDogModifiedDate(dogId)));

    if (dogIds.length > 0) {
      const dogId = dogIds[0];
      const getModifiedDateQuery = `SELECT post_modified FROM wp_posts WHERE ID = ?`;
      const [modifiedDateRows] = await config.db.query(getModifiedDateQuery, [
        dogId,
      ]);
      const newModifiedDate = modifiedDateRows[0].post_modified;
      return { newModifiedDate };
    }

    return { newModifiedDate: null };
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

const deleteSponsorByEmail = async (email) => {
  const connection = await config.db.getConnection();
  try {
    await connection.beginTransaction();

    const getSponsorIdQuery = "SELECT id FROM wp_custom_sponsors WHERE email = ?";
    const [sponsorRows] = await connection.query(getSponsorIdQuery, [email]);

    if (sponsorRows.length === 0) {
      throw new AppError("No se encontró ningún patrocinador con ese correo electrónico.", 404);
    }

    const sponsorId = sponsorRows[0].id;

    const getDogIdsQuery = "SELECT DISTINCT dog_id FROM wp_custom_dog_sponsors WHERE sponsor_id = ?";
    const [dogRows] = await connection.query(getDogIdsQuery, [sponsorId]);
    const dogIds = dogRows.map((row) => row.dog_id);

    const deleteDogSponsorsQuery = "DELETE FROM wp_custom_dog_sponsors WHERE sponsor_id = ?";
    await connection.query(deleteDogSponsorsQuery, [sponsorId]);

    const deleteSponsorQuery = "DELETE FROM wp_custom_sponsors WHERE id = ?";
    await connection.query(deleteSponsorQuery, [sponsorId]);

    await Promise.all(dogIds.map((dogId) => updateDogModifiedDate(dogId, connection)));

    await connection.commit();
  } catch (error) {
    await connection.rollback();
    console.error("Error al eliminar el patrocinador por correo electrónico:", error);
    throw new AppError(
      error.message || "Error en la capa de servicio al eliminar el patrocinador.",
      error.statusCode || 500
    );
  } finally {
    connection.release();
  }
};

const updateDogModifiedDate = async (dogId, connection) => {
  const sqlQuery = `
    UPDATE wp_posts
    SET post_modified = NOW(), post_modified_gmt = UTC_TIMESTAMP()
    WHERE ID = ?
  `;
  try {
    const db = connection || config.db;
    await db.query(sqlQuery, [dogId]);
  } catch (error) {
    console.error(`Error al actualizar la fecha de modificación para el perro ${dogId}:`, error);
    // We don't throw an error here because it's not critical for the main operation
  }
};

export default {
  fetchAllDogs,
  saveSponsors,
  saveSponsor,
  saveDogSponsor,
  fetchSponsorsByDogsIds,
  deleteDogSponsors,
  getAllSponsors,
  updateSponsor,
  deleteSponsorByEmail,
};
