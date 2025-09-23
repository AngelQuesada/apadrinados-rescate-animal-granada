import express from "express";
import wordpressController from "../controllers/wordpressController.js";

const router = express.Router();

router.get("/get-dogs", wordpressController.getDogs);
router.post("/save-sponsor", wordpressController.saveSponsor);
router.post("/save-dog-sponsor", wordpressController.saveDogSponsor);

export default router;
