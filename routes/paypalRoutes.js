import express from "express";
const router = express.Router();
import paypalController from "../controllers/paypalController.js";

router.get(
  "/get-subcriptions-plans/",
  paypalController.getAllSubscriptionsPlans
);
router.get(
  "/get-subcriptions-plans-ids/",
  paypalController.getAllSubscriptionsPlansIds
);
router.get(
  "/get-subscribers-for-all-subcriptions-plans/",
  paypalController.getSubscribersFromAllSubscriptionsPlans
);

export default router;
