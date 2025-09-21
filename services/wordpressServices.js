const config = require("../config");

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
    // Lanzamos el error para que el controlador pueda capturarlo.
    throw new Error(
      "Error en la capa de servicio al obtener los datos de los perros."
    );
  }
};

module.exports = {
  fetchAllDogs,
};
