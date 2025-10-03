const offerDAO = require("../repository/offerDAO");
const petDAO = require("../repository/petDAO");
const { nanoid } = require("nanoid");
const { logger } = require("../util/logger");

async function requestService(petOwnerId, petId, requesterId, services, description) {
    const pet = await petDAO.getPetById(petOwnerId, petId);
    if (!pet) {
        logger.info(`Pet not found: ${petId} for owner: ${petOwnerId}`);
        return null;
    }

    const requestedServices = Array.isArray(services) ? services : [services];
    if (!requestedServices.length) {
        logger.info(`No services provided for pet ${petId}`);
        return null;
    }
    const invalidServices = requestedServices.filter(s => !pet.services.includes(s));
    if (invalidServices.length > 0) {
        logger.info(`Invalid service(s) requested for pet ${petId}: ${invalidServices.join(", ")}`);
        return null;
    }

    const id = nanoid(5);
    const newOffer = {
        PK: petOwnerId,
        SK: `OFFER#${id}`,
        id,
        petId,
        requesterId: requesterId.replace(/^u#/, ""),
        services,
        description,
        status: "pending",
        createdAt: new Date().toLocaleString()
    };

    return await offerDAO.createOffer(newOffer);
}

module.exports = {
    requestService
};
