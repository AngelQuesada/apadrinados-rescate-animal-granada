import express from "express";
import wordpressController from "../controllers/wordpressController.js";

const router = express.Router();

router.get(
  "/get-dogs-structured-data",
  wordpressController.getStructuredDogsData
);
router.post("/save-sponsors", wordpressController.saveSponsors);
router.post("/save-sponsor", wordpressController.saveSponsor);
router.post("/save-dog-sponsor", wordpressController.saveDogSponsor);
router.post(
  "/save-sponsor-and-dog-sponsor",
  wordpressController.saveSponsorAndDogSponsor
);
router.put("/update-sponsor", wordpressController.updateSponsor);
router.delete(
  "/delete-dog-sponsors/:ids",
  wordpressController.deleteDogSponsors
);
router.delete(
  "/delete-sponsor-by-email/:email",
  wordpressController.deleteSponsorByEmail
);
router.get(
  "/get-sponsors-by-dogs-ids",
  wordpressController.getSponsorsByDogsIds
);
router.get("/get-all-sponsors", wordpressController.getAllSponsors);

export default router;
