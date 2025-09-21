const express = require("express");
const router = express.Router();
const wordpressController = require("../controllers/wordpressController");

router.get("/get-dogs", wordpressController.getDogs);

module.exports = router;
