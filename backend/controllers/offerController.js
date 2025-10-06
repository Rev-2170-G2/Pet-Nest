const offerService = require("../services/offerService");
const { logger } = require("../util/logger");

async function createOffer(req, res) {
    try {
        const loggedInUserPK = req.user.id;
        const offer = await offerService.createOffer(req.body, loggedInUserPK);

        if (!offer) {
            return res.status(400).json({ message: "Invalid offer or permission denied." });
        }

        return res.status(201).json(offer);
    } catch (error) {
        logger.error("Error creating offer:", error);
        return res.status(500).json({ message: "Server error creating offer." });
    }
}

async function deleteOffer(req, res) {
    const senderId = req.user.id;
    const { ownerId, entityId, offerId } = req.params;

    try {
        const deleted = await offerService.deleteOffer(senderId, ownerId, entityId, offerId);
        if (deleted) return res.status(200).json({ message: `Offer ${offerId} deleted.` });

        return res.status(404).json({ message: `Offer ${offerId} not found or not allowed.` });
    } catch (err) {
        logger.error(`Error deleting offer: ${err}`);
        return res.status(500).json({ message: "Server error." });
    }
}

async function getOffersForEntity(req, res) {
    const { ownerId, entityId } = req.params;

    try {
        const offers = await offerService.getOffersForEntity(ownerId, entityId);
        return res.status(200).json({ offers });
    } catch (err) {
        logger.error(`Error in getOffersForEntity: ${err}`);
        return res.status(500).json({ message: "Server error" });
    }
}

async function getOffersSentByUser(req, res) {
    const userId = req.user.id;

    try {
        const offers = await offerService.getOffersSentByUser(userId);
        return res.status(200).json({ offers });
    } catch (err) {
        logger.error(`Error in getOffersSentByUser: ${err}`);
        return res.status(500).json({ message: "Server error" });
    }
}

module.exports = {
    createOffer,
    deleteOffer,
    getOffersForEntity,
    getOffersSentByUser
};