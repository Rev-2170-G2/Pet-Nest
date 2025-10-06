const petDAO = require("../repository/petDAO");
const { nanoid } = require('nanoid');
const {logger} = require('../util/logger');
const { buildPetUpdates } = require('../util/pet/petUpdateBuilder');

async function createPet(userId, pet){
    //check if userId exists(not needed - already checked in middleware)
    if(userId){
        const data = await petDAO.createPet(userId, {
            id: nanoid(5),
            entity: "PET",
            type: pet.type,
            name: pet.name,
            services: pet.services.map(s => ({
                service: s.service,
                price: s.price
            })),
            description: pet.description,
            photos: pet.images ?? null,
            location: pet.location ?? null,
            offers: []

        })
        logger.info(`${userId} added new pet: ${JSON.stringify(data)}`);
        return data;
    }
        logger.info(`Failed to validate user: ${JSON.stringify(userId)}`);
        return null;
}

async function updatePet(userId, petId, updates) {
    if (!userId || !petId) return null;
    
    const dbUpdates = buildPetUpdates(updates);
    const data = await petDAO.updatePet(userId, petId, dbUpdates);
    if (data) {
        logger.info(`Pet ${petId} updated for user ${userId}: ${JSON.stringify(data)}`);
        return data;
    }
    logger.info(`Failed to update pet ${petId} for user ${userId}`);
    return null;
}

async function deletePet(userId, petId) {
    const data = await petDAO.deletePet(userId, petId);
    if (data) {
        logger.info(`Pet ${petId} deleted for user ${userId}`);
        return data;
    }
    logger.info(`Failed to delete pet ${petId} for user ${userId}`);
    return null;
}

async function getAllPetServices(){
    const data = await petDAO.getAllPetServices();
    if(data){
        logger.info(`(petService) Pet services found: ${JSON.stringify(data)}`);
        return data;
    }
    logger.info(`(petService) No pet services found.`);
    return null;
}

module.exports = {
    createPet,
    updatePet,
    deletePet,
    getAllPetServices
}