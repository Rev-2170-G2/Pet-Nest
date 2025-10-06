const offerService = require("../services/offerService");
const { logger } = require("../util/logger");

const createOffer = async (req, res) => {
    const requesterId = req.user.id;
    const body = req.body;

    const offer = await offerService.createOffer(body, requesterId);

    if (offer) {
        return res.status(201).json({
            message: "Offer created.",
            offer
        });
    }
    return res.status(400).json({ message: "Failed to create offer." });
};

const deleteOffer = async (req, res) => {
    const senderId = req.user.id;
    const ownerId = req.params.ownerId;
    const entityId = req.params.entityId;
    const offerId = req.params.offerId;

    try {
        const deleted = await offerService.deleteOffer(senderId, ownerId, entityId, offerId);
        if (deleted) {
            return res.status(200).json({ message: `Offer ${offerId} deleted.` });
        }
        return res.status(404).json({ message: `Offer ${offerId} not found or you are not the sender.` });
    } catch (err) {
        logger.error(`Error deleting offer: ${err}`);
        return res.status(500).json({ message: "Server error." });
    }
};

module.exports = {
    createOffer,
    deleteOffer
};