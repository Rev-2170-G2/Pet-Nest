const offerService = require("../services/offerService");
const { logger } = require("../util/logger");

async function createOffer(req, res) {
    const userId = req.user.id;
    try {
        const offer = await offerService.createOffer(req.body, userId);

        if (!offer) {
            logger.info(`${userId} attempted to create an invalid offer: ${JSON.stringify(req.body)}`);
            return res.status(400).json({ message: "Invalid offer or permission denied." });
        }

        logger.info(`${userId} created new offer: ${JSON.stringify(offer)}`);
        return res.status(201).json({ message: "Offer created", data: offer });
    } catch (err) {
        logger.error(`Error creating offer for user ${userId}: ${err}`);
        return res.status(500).json({ message: "Server error creating offer." });
    }
}

async function deleteOffer(req, res) {
    const senderId = req.user.id;
    const { ownerId, entityId, offerId } = req.params;

    try {
        const deleted = await offerService.deleteOffer(senderId, ownerId, entityId, offerId);
        if (!deleted) {
            logger.info(`${senderId} failed to delete offer ${offerId} on entity ${entityId}`);
            return res.status(404).json({ message: `Offer ${offerId} not found or not allowed.` });
        }

        logger.info(`${senderId} deleted offer ${offerId} from entity ${entityId}`);
        return res.status(200).json({ message: `Offer ${offerId} deleted`, data: deleted });
    } catch (err) {
        logger.error(`Error deleting offer ${offerId} by user ${senderId}: ${err}`);
        return res.status(500).json({ message: "Server error." });
    }
}

async function getOffersForEntity(req, res) {
    const userId = req.user.id;
    const { ownerId, entityId } = req.params;

    if (userId.split('#')[1] !== ownerId) {
        logger.info(`${userId} attempted to view offers for owner ${ownerId}`);
        return res.status(403).json({ message: "Forbidden: you cannot view these offers." });
    }

    try {
        const offers = await offerService.getOffersForEntity(ownerId, entityId);
        return res.status(200).json({ message: "Offers retrieved", data: offers });
    } catch (err) {
        logger.error(`Error retrieving offers for entity ${entityId}: ${err}`);
        return res.status(500).json({ message: "Server error." });
    }
}

async function getOffersSentByUser(req, res) {
    const userId = req.user.id;
    try {
        const offers = await offerService.getOffersSentByUser(userId);
        return res.status(200).json({ message: "Offers sent by user retrieved", data: offers });
    } catch (err) {
        logger.error(`Error retrieving offers sent by user ${userId}: ${err}`);
        return res.status(500).json({ message: "Server error." });
    }
}

module.exports = {
    createOffer,
    deleteOffer,
    getOffersForEntity,
    getOffersSentByUser
};