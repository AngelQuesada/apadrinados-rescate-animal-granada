import getPaypalInstance from "../services/paypalServices.js";

const getAllSubscriptionsPlans = async (req, res) => {
  try {
    const paypalServices = await getPaypalInstance();
    console.log("paypalServices", paypalServices);
    const allPlans = await paypalServices.fetchSubscriptions();
    res.status(200).json(allPlans.plans);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el plan de suscripción" });
  }
};

const getAllSubscriptionsPlansIds = async (req, res) => {
  try {
    const paypalServices = await getPaypalInstance();
    const allPlans = await paypalServices.fetchSubscriptions();
    const plansIds = allPlans.plans.map((plan) => plan.id);
    res.status(200).json(plansIds);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el plan de suscripción" });
  }
};

const getSubscribersFromAllSubscriptionsPlans = async (req, res) => {
  try {
    const paypalServices = await getPaypalInstance();
    const allPlans = await paypalServices.fetchSubscriptions();
    const plansIds = allPlans.plans.map((plan) => plan.id);
    const subscribers =
      await paypalServices.fetchSubscribersFromSubscriptionsPlans(plansIds);
    console.log("Suscriptores:", subscribers);
    res.status(200).json(subscribers);
  } catch (error) {
    res.status(500).json({
      error: "Error al obtener los suscriptores del plan de suscripción",
    });
  }
};

const getSubscribersFromSubscriptionPlan = async (req, res) => {
  try {
    const { plansIds } = req.params;
    const paypalServices = await getPaypalInstance();
    const subscribers =
      await paypalServices.fetchSubscribersFromSubscriptionsPlans(plansIds);
    res.status(200).json(subscribers);
  } catch (error) {
    res.status(500).json({
      error: "Error al obtener los suscriptores del plan de suscripción",
    });
  }
};

/**
 * Obtiene los detalles completos de un plan incluyendo suscriptores activos
 * @param {Object} req - Objeto de solicitud
 * @param {Object} res - Objeto de respuesta
 */
const getSubscriptionPlanDetails = async (req, res) => {
  try {
    const { planId } = req.params;
    const planDetails = await paypalServices.getSubscriptionPlanDetails(planId);
    res.json({
      message: "Detalles del plan obtenidos correctamente",
      data: planDetails,
    });
  } catch (error) {
    console.error("Error al obtener detalles del plan:", error);
    res.status(500).json({
      error: "Error al obtener detalles del plan de suscripción",
      message: error.message,
    });
  }
};

export default {
  getAllSubscriptionsPlansIds,
  getAllSubscriptionsPlans,
  getSubscriptionPlanDetails,
  getSubscribersFromAllSubscriptionsPlans,
  getSubscribersFromSubscriptionPlan,
};
