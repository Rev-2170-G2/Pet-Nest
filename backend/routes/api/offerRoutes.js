const express = require("express");
const router = express.Router();

const offerController = require("../../controllers/offerController");
const { authenticateToken } = require("../../util/jwt");

router.post("/", authenticateToken, offerController.createOffer);

router.delete('/:ownerId/:entityId/:offerId', authenticateToken, offerController.deleteOffer);

router.get("/:ownerId/:entityId", authenticateToken, offerController.getOffersForEntity);

router.get("/sent", authenticateToken, offerController.getOffersSentByUser);

module.exports = router;