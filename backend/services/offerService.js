const offerDAO = require("../repository/offerDAO");
const { nanoid } = require("nanoid");
const { logger } = require("../util/logger");

async function createOffer(body, loggedInUserPK) {
    const { requesterSK, requestedSK, requestedOwnerId, services, description } = body;

    if (!requesterSK || !requestedSK || !requestedOwnerId || !Array.isArray(services) || services.length === 0) {
        logger.info(`Invalid offer body from ${loggedInUserPK}: ${JSON.stringify(body)}`);
        return null;
    }

    const requesterPK = loggedInUserPK;
    const requestedPK = requestedOwnerId.startsWith("u#") ? requestedOwnerId : `u#${requestedOwnerId}`;

    const requesterEntity = await offerDAO.getEntity(requesterPK, requesterSK);
    if (!requesterEntity) return null;

    const requestedEntity = await offerDAO.getEntity(requestedPK, requestedSK);
    if (!requestedEntity) return null;

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
    const prefixes = ["PET#", "EVENT#"];

    for (const prefix of prefixes) {
        const SK = prefix + entityId;
        const deleted = await offerDAO.removeOfferBySender(PK, SK, offerId, senderId);
        if (deleted) return deleted;
    }
    return null;
}

async function getOffersSentByUser(userId) {
    return await offerDAO.getOffersSentByUser(userId);
}

async function updateOfferStatus(ownerId, entityId, offerId, newStatus) {
    if (!["approved", "denied"].includes(newStatus)) return null;

    const prefixes = ["PET#", "EVENT#"];
    for (const prefix of prefixes) {
        const SK = prefix + entityId;
        const entity = await offerDAO.getEntity(ownerId, SK);
        if (!entity?.offers) continue;

        const offerIndex = entity.offers.findIndex(o => o.id === offerId);
        if (offerIndex === -1) continue;

        const offer = entity.offers[offerIndex];
        if (offer.requestedPK !== ownerId) return null;

        entity.offers[offerIndex].status = newStatus;
        const updatedEntity = await offerDAO.updateEntityOffers(ownerId, SK, entity.offers);
        if (!updatedEntity) return null;

        return updatedEntity.offers[offerIndex];
    }
    return null;
}

async function getAllReceivedOffers(userId) {
    const entities = await offerDAO.getEntitiesByOwner(userId);
    const allOffers = [];

    entities.forEach(entity => {
        if (Array.isArray(entity.offers)) {
            entity.offers.forEach(o => allOffers.push({
                ...o,
                entityId: entity.SK,
                entityType: entity.SK.split("#")[0]
            }));
        }
    });

    return allOffers;
}

module.exports = {
    createOffer,
    deleteOffer,
    getOffersSentByUser,
    updateOfferStatus,
    getAllReceivedOffers
};