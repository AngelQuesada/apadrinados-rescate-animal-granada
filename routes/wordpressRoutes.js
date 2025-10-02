import express from "express";
import wordpressController from "../controllers/wordpressController.js";

const router = express.Router();

router.get(
  "/get-dogs-structured-data",
  wordpressController.getStructuredDogsData
);
router.post("/save-sponsors", wordpressController.saveSponsors);
router.post("/save-dog-sponsor", wordpressController.saveDogSponsor);
router.get(
  "/get-sponsors-by-dogs-ids",
  wordpressController.getSponsorsByDogsIds
);

export default router;
