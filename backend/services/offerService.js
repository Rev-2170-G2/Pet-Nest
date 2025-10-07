const offerDAO = require("../repository/offerDAO");
const { nanoid } = require("nanoid");
const { logger } = require("../util/logger");

const PREFIXES = {PET: "PET#", EVENT: "EVENT#", USER: "USER#"};

async function createOffer(body, loggedInUserPK) {
    const {requesterType, requesterId, requestedType, requestedId, requestedOwnerId, services, description} = body;

    if (!requesterType || !requesterId || !requestedType || !requestedId || !requestedOwnerId || !Array.isArray(services) || services.length === 0) {
        logger.info(`Invalid offer body from ${loggedInUserPK}: ${JSON.stringify(body)}`);
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
    const entityPrefixes = ["PET#", "EVENT#"];

    for (const prefix of entityPrefixes) {
        const SK = prefix + entityId;
        const deleted = await offerDAO.removeOfferBySender(PK, SK, offerId, senderId);
        if (deleted) return deleted;
    }

    return null;
}

async function getOffersForEntity(ownerId, entityId) {
    const PK = `u#${ownerId}`;

    const petOffers = await offerDAO.getOffersByEntity(PK, `PET#${entityId}`);
    if (petOffers.length) return petOffers;

    const eventOffers = await offerDAO.getOffersByEntity(PK, `EVENT#${entityId}`);
    if (eventOffers.length) return eventOffers;

    return [];
}

async function getOffersSentByUser(userId) {
    try {
        return await offerDAO.getOffersSentByUser(userId);
    } catch (err) {
        logger.error(`Error fetching offers sent by user ${userId}: ${err}`);
        return [];
    }
}

async function updateOfferStatus(ownerId, entityId, offerId, newStatus) {
    if (!["approved", "denied"].includes(newStatus)) {
        logger.info(`Invalid status '${newStatus}' for offer ${offerId}`);
        return null;
    }

    const entityPrefixes = ["PET#", "EVENT#"];
    for (const prefix of entityPrefixes) {
        const SK = prefix + entityId;
        const entity = await offerDAO.getEntity(ownerId, SK);
        if (!entity || !entity.offers) continue;

        const offerIndex = entity.offers.findIndex(o => o.id === offerId);
        if (offerIndex === -1) continue;

        const offer = entity.offers[offerIndex];
        if (offer.requestedPK !== ownerId) {
            logger.info(`User ${ownerId} attempted to update offer ${offerId} not belonging to them`);
            return null;
        }

        entity.offers[offerIndex].status = newStatus;

        const updatedEntity = await offerDAO.updateEntityOffers(ownerId, SK, entity.offers);
        if (!updatedEntity) return null;

        logger.info(`Offer ${offerId} status updated to ${newStatus} by ${ownerId}`);
        return updatedEntity.offers[offerIndex];
    }

    logger.info(`Offer ${offerId} not found for user ${ownerId}`);
    return null;
}

module.exports = {
    createOffer,
    deleteOffer,
    getOffersForEntity,
    getOffersSentByUser,
    updateOfferStatus
};