const offerDAO = require("../repository/offerDAO");
const { nanoid } = require("nanoid");
const { logger } = require("../util/logger");

async function createOffer(body, userPK) {
    const {requester, requested, requestedOwnerId, services, description} = body;

    if (!requester || !requested || !requestedOwnerId || !Array.isArray(services) || services.length === 0) {
        logger.info("Missing or invalid fields in offer creation.");
        return null;
    }

    const requesterItem = await offerDAO.getItem(userPK, requester);
    if (!requesterItem) {
        logger.info(`Requester not found: PK:${userPK} SK:${requester}`);
        return null;
    }

    const requestedItem = await offerDAO.getItem(requestedOwnerId, requested);
    if (!requestedItem) {
        logger.info(`Requested item not found: PK:${requestedOwnerId} SK:${requested}`);
        return null;
    }

    let petItem = null;
    if (requesterItem.entity === "PET") petItem = requesterItem;
    else if (requestedItem.entity === "PET") petItem = requestedItem;

    if (petItem) {
        if (!Array.isArray(petItem.services) || petItem.services.length === 0) {
            logger.info(`Pet has no services defined: ${petItem.SK || petItem.id}`);
            return null;
        }
        const invalidServices = services.filter(s => !petItem.services.includes(s));
        if (invalidServices.length > 0) {
            logger.info(`Invalid service(s) requested (not offered by pet): ${invalidServices.join(", ")}`);
            return null;
        }
    }

    const offerId = nanoid(5);
    const offerRequest = {
        id: offerId,
        requester,
        requested,
        services,
        description: description || "",
        status: "pending",
        createdAt: new Date().toLocaleString()
    };

    const updatedRequester = await offerDAO.updateOffers(userPK, requester, "offersSent", offerRequest);
    const updatedRequested = await offerDAO.updateOffers(requestedOwnerId, requested, "offersReceived", offerRequest);

    if (!updatedRequester || !updatedRequested) {
        logger.info("Failed to create offer.");
        return null;
    }

    logger.info(`Offer created: ${JSON.stringify(offerRequest)}`);
    return offerRequest;
}

module.exports = {
    createOffer
};
