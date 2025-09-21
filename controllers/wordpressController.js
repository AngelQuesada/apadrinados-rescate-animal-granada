const wordpressService = require("../services/wordpressServices");

const getDogs = async (req, res) => {
  try {
    const rawResults = await wordpressService.fetchAllDogs();

    let dogs_list = [];
    if (rawResults && Array.isArray(rawResults)) {
      dogs_list = rawResults.map((perro) => ({
        name: perro.post_title,
        modified: perro.post_modified,
        status: perro.post_status,
        image_url: perro.featured_image_url,
        id_paypal_subscription: perro.id_suscripcion_paypal,
      }));
    }

    res.json({
      ok: true,
      count: dogs_list.length,
      dogs: dogs_list,
    });
  } catch (error) {
    console.error("Error en el controlador al obtener los perros:", error);
    res.status(500).json({
      ok: false,
      message: "Error interno del servidor al obtener la lista de perros.",
      errorCode: "DOGS_FETCH_ERROR",
    });
  }
};

const wordpressControllers = { getDogs };

module.exports = wordpressControllers;
