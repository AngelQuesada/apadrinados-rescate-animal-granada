import wordpressService from "../services/wordpressServices.js";

const getStructuredDogsData = async (req, res, next) => {
  try {
    const dogsRawData = await wordpressService.fetchAllDogs();

    let dogsData = [];
    if (dogsRawData && Array.isArray(dogsRawData)) {
      dogsData = dogsRawData.map((perro) => ({
        id: perro.id,
        name: perro.post_title,
        modified: perro.post_modified,
        status: perro.post_status,
        imageUrl: perro.featured_image_url,
        id_paypal_subscription: perro.id_suscripcion_paypal,
        sponsors: [],
      }));
    }

    const sponsorsData = await wordpressService.fetchSponsorsByDogsIds(
      dogsData.map((dog) => dog.id)
    );

    const structuredSponsors = sponsorsData.reduce((acc, sponsor) => {
      acc[sponsor.dog_id] = acc[sponsor.dog_id] || [];
      acc[sponsor.dog_id].push({
        dog_sponsor_id: sponsor.dog_sponsor_id,
        id: sponsor.sponsor_id,
        name: sponsor.name,
        email: sponsor.email,
        is_active: sponsor.is_active,
        created_at: sponsor.created_at,
        source: parseInt(sponsor.source),
        id_suscripcion_paypal: sponsor.id_suscripcion_paypal,
      });

      return acc;
    }, {});

    dogsData.forEach((dog) => {
      if (structuredSponsors[dog.id]) {
        dog.sponsors = structuredSponsors[dog.id]
          ? structuredSponsors[dog.id]
          : [];
      }
    });

    res.json({
      ok: true,
      count: dogsData.length,
      dogs: dogsData,
    });
  } catch (error) {
    next(error);
  }
};

const getSponsorsByDogsIds = async (req, res, next) => {
  try {
    const { dogs_ids } = req.body;
    const sponsors = await wordpressService.fetchSponsorsByDogsIds(dogs_ids);
    const structuredSponsors = sponsors.reduce((acc, sponsor) => {
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
      count: structuredSponsors.length,
      structuredSponsors,
    });
  } catch (error) {
    next(error);
  }
};

const saveSponsors = async (req, res, next) => {
  try {
    const { sponsors } = req.body;

    await wordpressService.saveSponsors(sponsors);
    res.status(200).json({
      ok: true,
      message: "Patrocinadores guardados con éxito.",
    });
  } catch (error) {
    next(error);
  }
};

const saveSponsor = async (req, res, next) => {
  try {
    const { name, email } = req.body;

    await wordpressService.saveSponsor({ name, email });
    res.status(200).json({
      ok: true,
      message: "Padrino guardado con éxito.",
    });
  } catch (error) {
    next(error);
  }
};

const deleteDogSponsors = async (req, res, next) => {
  try {
    const { ids } = req.params;
    const dogSponsorIds = ids.split(",");

    await wordpressService.deleteDogSponsors({ dogSponsorIds });
    res.status(200).json({
      ok: true,
      message: "Relación(es) padrino - perro eliminada(s) con éxito.",
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

const saveSponsorAndDogSponsor = async (req, res, next) => {
  try {
    const { name, email, dog_id } = req.body;

    const response = await wordpressService.saveSponsor({ name, email });

    const { insertId } = response[0];

    await wordpressService.saveDogSponsor({
      dog_id,
      sponsor_id: insertId,
      end_date: null,
      source: 0,
      is_active: true,
    });

    const newSponsorData = {
      dog_sponsor_id: response[0].insertId,
      id: insertId,
      name,
      email,
      is_active: true,
      created_at: new Date().toISOString(),
      source: 0,
    };

    res.status(200).json({
      ok: true,
      message: "Padrino y relación con perro guardadas correctamente",
      newSponsor: newSponsorData,
    });
  } catch (error) {
    next(error);
  }
};

const getAllSponsors = async (req, res, next) => {
  try {
    const sponsors = await wordpressService.getAllSponsors();
    res.status(200).json({
      ok: true,
      count: sponsors.length,
      sponsors,
    });
  } catch (error) {
    next(error);
  }
};

const wordpressController = {
  getStructuredDogsData,
  saveSponsors,
  saveDogSponsor,
  saveSponsorAndDogSponsor,
  getSponsorsByDogsIds,
  getAllSponsors,
  saveSponsor,
  deleteDogSponsors,
};

export default wordpressController;
