const offerDAO = require("../repository/offerDAO");
const { nanoid } = require("nanoid");
const { logger } = require("../util/logger");

const PREFIXES = { PET: "PET#", EVENT: "EVENT#", USER: "USER#" };

async function createOffer(body, loggedInUserPK) {
    const { requesterType, requesterId, requestedType, requestedId, requestedOwnerId, services, description } = body;

    if (!requesterType || !requesterId || !requestedType || !requestedId || !requestedOwnerId || !Array.isArray(services) || services.length === 0) {
        logger.info("Invalid offer body format:", body);
        return null;
    }

    const requesterPK = loggedInUserPK;
    const requesterSK = PREFIXES[requesterType.toUpperCase()] + requesterId;
    const requestedPK = requestedOwnerId.startsWith("u#") ? requestedOwnerId : `u#${requestedOwnerId}`;
    const requestedSK = PREFIXES[requestedType.toUpperCase()] + requestedId;

    const requesterEntity = await offerDAO.getEntity(requesterPK, requesterSK);
    if (!requesterEntity) {
        logger.info(`Requester entity ${requesterSK} does not belong to user ${loggedInUserPK}`);
        return null;
    }

    const requestedEntity = await offerDAO.getEntity(requestedPK, requestedSK);
    if (!requestedEntity) {
        logger.info(`Requested entity ${requestedSK} does not exist for owner ${requestedPK}`);
        return null;
    }

    const newOffer = {
        id: nanoid(5),
        requesterPK,
        requesterSK,
        requestedPK,
        requestedSK,
        services,
        description,
        status: "pending",
        createdAt: new Date().toISOString()
    };

    const added = await offerDAO.addOffer(requestedPK, requestedSK, newOffer);
    if (!added) return null;

    logger.info(`Offer ${newOffer.id} created from ${requesterSK} to ${requestedSK}`);
    return newOffer;
}

async function deleteOffer(senderId, ownerId, entityId, offerId) {
    const PK = `u#${ownerId}`;
    const entityType = ["PET#", "EVENT#"];
    for (const prefix of entityType) {
        const SK = prefix + entityId;
        const deleted = await offerDAO.removeOfferBySender(PK, SK, offerId, senderId);
        if (deleted) return deleted;
    }
    return null;
}

async function getOffersForEntity(ownerId, entityId) {
    try {
        const prefixes = ["PET#", "EVENT#"];
        for (const prefix of prefixes) {
            const offers = await offerDAO.getOffersByEntity(ownerId, prefix + entityId);
            if (offers) return offers;
        }
        return [];
    } catch (err) {
        logger.error(`Error fetching offers for entity ${entityId}: ${err}`);
        return [];
    }
}

async function getOffersSentByUser(userId) {
    try {
        return await offerDAO.getOffersSentByUser(userId);
    } catch (err) {
        logger.error(`Error fetching offers sent by user ${userId}: ${err}`);
        return [];
    }
}

module.exports = {
    createOffer,
    deleteOffer,
    getOffersForEntity,
    getOffersSentByUser
};