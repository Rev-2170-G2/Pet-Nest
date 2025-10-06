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

module.exports = {
    createOffer
};