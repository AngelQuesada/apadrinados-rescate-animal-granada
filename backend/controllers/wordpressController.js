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
        sponsor_id: sponsor.sponsor_id,
        name: sponsor.name,
        email: sponsor.email,
        is_active: sponsor.is_active,
        created_at: sponsor.created_at,
        source: sponsor.source,
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
  getStructuredDogsData,
  saveSponsors,
  saveDogSponsor,
  getSponsorsByDogsIds,
};

export default wordpressController;
