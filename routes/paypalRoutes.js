import express from "express";
import paypalController from "../controllers/paypalController.js";

const router = express.Router();

router.get(
  "/get-subcriptions-plans/",
  paypalController.getAllSubscriptionsPlans
);
router.get(
  "/get-subcriptions-plans-ids/",
  paypalController.getAllSubscriptionsPlansIds
);
router.get(
  "/get-subscribers-from-all-subcriptions-plans/",
  paypalController.getSubscribersFromAllSubscriptionsPlans
);
router.get(
  "/get-subscribers-from-subscriptions-plans/:plansIds",
  paypalController.getSubscribersFromSubscriptionsPlans
);

export default router;
