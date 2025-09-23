import wordpressService from "../services/wordpressServices.js";

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

const saveSponsor = async (req, res) => {
  try {
    const { name, email } = req.body;
    await wordpressService.saveSponsor(name, email);
    res.status(200).json({
      ok: true,
      message: "Suscriptor guardado con éxito.",
    });
  } catch (error) {
    console.error("Error en el controlador al guardar el suscriptor:", error);
    res.status(500).json({
      ok: false,
      message: "Error interno del servidor al guardar el suscriptor.",
      errorCode: "SPONSOR_SAVE_ERROR",
    });
  }
};

const saveDogSponsor = async (req, res) => {
  try {
    const { dog_id, sponsor_id, start_date, end_date, source, is_active } =
      req.body;
    await wordpressService.saveDogSponsor(
      dog_id,
      sponsor_id,
      start_date,
      end_date,
      source,
      is_active
    );
    res.status(200).json({
      ok: true,
      message: "Relación padrino-perro guardada con éxito.",
    });
  } catch (error) {
    console.error(
      "Error en el controlador al guardar la relación padrino-perro:",
      error
    );
    res.status(500).json({
      ok: false,
      message:
        "Error interno del servidor al guardar la relación padrino-perro.",
      errorCode: "DOG_SPONSOR_SAVE_ERROR",
    });
  }
};

const wordpressController = { getDogs, saveSponsor, saveDogSponsor };

export default wordpressController;
