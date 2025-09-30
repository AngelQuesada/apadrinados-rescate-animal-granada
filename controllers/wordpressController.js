import wordpressService from "../services/wordpressServices.js";

const getDogs = async (req, res, next) => {
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
    next(error);
  }
};

const getSponsorsByDogsIds = async (req, res, next) => {
  try {
    const { dogs_ids } = req.body;
    const sponsors = await wordpressService.fetchSponsorsByDogsIds(dogs_ids);
    const structured_sponsors = sponsors.reduce((acc, sponsor) => {
      acc[sponsor.dog_id] = acc[sponsor.dog_id] || [];
      acc[sponsor.dog_id].push({
        dog_sponsor_id: sponsor.dog_sponsor_id,
        sponsor_id: sponsor.sponsor_id,
        name: sponsor.name,
        email: sponsor.email,
        is_active: sponsor.is_active,
        created_at: sponsor.created_at,
        id_suscripcion_paypal: sponsor.id_suscripcion_paypal,
      });

      return acc;
    }, {});
    res.status(200).json({
      ok: true,
      count: structured_sponsors.length,
      structured_sponsors,
    });
  } catch (error) {
    next(error);
  }
};

const saveSponsor = async (req, res, next) => {
  try {
    const { name, email } = req.body;
    await wordpressService.saveSponsor(name, email);
    res.status(200).json({
      ok: true,
      message: "Suscriptor guardado con éxito.",
    });
  } catch (error) {
    next(error);
  }
};

const saveDogSponsor = async (req, res, next) => {
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
    next(error);
  }
};

const wordpressController = {
  getDogs,
  saveSponsor,
  saveDogSponsor,
  getSponsorsByDogsIds,
};

export default wordpressController;
