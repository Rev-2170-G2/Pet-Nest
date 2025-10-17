const express = require("express");
const router = express.Router();

const offerController = require("../../controllers/offerController");
const { authenticateToken } = require("../../util/jwt");

router.post("/", authenticateToken, offerController.createOffer);

router.delete('/:petId/:offerId', authenticateToken, offerController.deleteOffer);

router.get("/sent", authenticateToken, offerController.getOffersSentByUser);

router.get("/received", authenticateToken, offerController.getAllReceivedOffers);

router.put('/:id/status', authenticateToken, offerController.updateOfferStatus);

module.exports = router;