import getPaypalInstance from "../services/paypalServices.js";
import AppError from "../utils/AppError.js";

const getAllSubscriptionsPlans = async (req, res, next) => {
  try {
    const paypalServices = await getPaypalInstance();
    console.log("paypalServices", paypalServices);
    const allPlans = await paypalServices.fetchSubscriptions();
    res.status(200).json(allPlans.plans);
  } catch (error) {
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
    next(error);
  }
};

const getSubscribersFromSubscriptionPlan = async (req, res, next) => {
  try {
    const { plansIds } = req.params;
    const paypalServices = await getPaypalInstance();
    const subscribers =
      await paypalServices.fetchSubscribersFromSubscriptionsPlans(plansIds);
    res.status(200).json(subscribers);
  } catch (error) {
    next(error);
  }
};

/**
 * Obtiene los detalles completos de un plan incluyendo suscriptores activos
 * @param {Object} req - Objeto de solicitud
 * @param {Object} res - Objeto de respuesta
 */
const getSubscriptionPlanDetails = async (req, res, next) => {
  try {
    const { planId } = req.params;
    const planDetails = await paypalServices.getSubscriptionPlanDetails(planId);
    res.json({
      message: "Detalles del plan obtenidos correctamente",
      data: planDetails,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getAllSubscriptionsPlansIds,
  getAllSubscriptionsPlans,
  getSubscriptionPlanDetails,
  getSubscribersFromAllSubscriptionsPlans,
  getSubscribersFromSubscriptionPlan,
};
