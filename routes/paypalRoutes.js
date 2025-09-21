const express = require("express");
const router = express.Router();
const paypalController = require("../controllers/paypalController");

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

module.exports = router;
