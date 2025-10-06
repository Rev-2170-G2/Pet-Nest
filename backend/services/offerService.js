const offerDAO = require("../repository/offerDAO");
const { nanoid } = require("nanoid");
const { logger } = require("../util/logger");

async function createOffer(body, requesterId) {
    const {requested, requestedOwnerId, services, description} = body;

    if (!requested || !requestedOwnerId || !Array.isArray(services) || services.length === 0) {
        logger.info("Missing or invalid fields in offer creation.");
        return null;
    }

    const offer = {
        id: nanoid(5),
        requester: requesterId,
        requested,
        services,
        description,
        status: "pending",
        createdAt: new Date().toISOString()
    };

    try {
        await offerDAO.addOffer(requestedOwnerId, requested, offer);
        logger.info(`Offer ${offer.id} added to ${requested}`);
        return offer;
    } catch (err) {
        logger.error(`Failed to create offer: ${err}`);
        return null;
    }
}

module.exports = {
    createOffer
};
