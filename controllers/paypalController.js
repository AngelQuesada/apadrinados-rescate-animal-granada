import getPaypalInstance from "../services/paypalServices.js";

const getAllSubscriptionsPlans = async (req, res, next) => {
  try {
    const paypalServices = await getPaypalInstance();
    const allPlans = await paypalServices.fetchSubscriptions();
    res.status(200).json(allPlans.plans);
  } catch (error) {
    console.error("Error al obtener los planes de suscripción:", error);
    next(error);
  }
};

const getAllSubscriptionsPlansIds = async (req, res, next) => {
  try {
    const paypalServices = await getPaypalInstance();
    const allPlans = await paypalServices.fetchSubscriptions();
    const plansIds = allPlans.plans.map((plan) => plan.id);
    res.status(200).json(plansIds);
  } catch (error) {
    console.error("Error al obtener los planes de suscripción:", error);
    next(error);
  }
};

const getSubscribersFromAllSubscriptionsPlans = async (req, res, next) => {
  try {
    const paypalServices = await getPaypalInstance();
    const allPlans = await paypalServices.fetchSubscriptions();
    const plansIds = allPlans.plans.map((plan) => plan.id);
    const subscribers =
      await paypalServices.fetchSubscribersFromSubscriptionsPlans(plansIds);
    res.status(200).json(subscribers);
  } catch (error) {
    console.error("Error al obtener los suscriptores de los planes:", error);
    next(error);
  }
};

const getSubscribersFromSubscriptionsPlans = async (req, res, next) => {
  try {
    const { plansIds } = req.params;
    const plansIdsList = plansIds.split(",");
    const paypalServices = await getPaypalInstance();
    const subscribers =
      await paypalServices.fetchSubscribersFromSubscriptionsPlans(plansIdsList);
    res.status(200).json(subscribers);
  } catch (error) {
    console.error("Error al obtener los suscriptores de los planes:", error);
    next(error);
  }
};

const getSubscriptionPlanDetails = async (req, res, next) => {
  try {
    const { planId } = req.params;
    const planDetails = await paypalServices.getSubscriptionPlanDetails(planId);
    res.json({
      message: "Detalles del plan obtenidos correctamente",
      data: planDetails,
    });
  } catch (error) {
    console.error("Error al obtener los detalles del plan:", error);
    next(error);
  }
};

export default {
  getAllSubscriptionsPlansIds,
  getAllSubscriptionsPlans,
  getSubscriptionPlanDetails,
  getSubscribersFromAllSubscriptionsPlans,
  getSubscribersFromSubscriptionsPlans,
};
