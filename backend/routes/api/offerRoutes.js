const express = require("express");
const router = express.Router();

const offerController = require("../../controllers/offerController");
const { authenticateToken } = require("../../util/jwt");

router.post("/", authenticateToken, offerController.createOffer);

module.exports = router;