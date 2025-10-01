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
            services: pet.services,
            description: pet.description,
            photos: pet.images ?? null,
            location: pet.location ?? null
        })
        logger.info(`${userId} added new pet: ${JSON.stringify(data)}`);
        return data;
    }
        logger.info(`Failed to validate user: ${JSON.stringify(userId)}`);
        return null;
}

async function updatePet(userId, petId, updates) {
    if (!userId || !petId) {
        logger.info(`Invalid userId or petId: ${userId}, ${petId}`);
        return null;
    }

    const dbUpdates = buildPetUpdates(updates);

    try {
        const data = await petDAO.updatePet(userId, petId, dbUpdates);
        return data;
    } catch (error) {
        console.error(error);
        return null;
    }
}

async function deletePet(userId, petId){
    try{ 
        const data = await petDAO.deletePet(userId, petId);
        return data;
    }
    catch(error){
        logger.info(`Pet not found or does not belong to user ${userId}: ${petId}`);
        return null;
    }
}

module.exports = {
    createPet,
    updatePet,
    deletePet
}