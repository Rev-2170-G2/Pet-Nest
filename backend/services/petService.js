const petDAO = require("../repository/petDAO");
const { nanoid } = require('nanoid');
const {logger} = require('../util/logger')

async function createPet(userId, pet){
    //check if userId exists, then add Pet
    if(userId){
        const data = await petDAO.addPet(userId, {
            id: nanoid(5),
            type: pet.type,
            name: pet.name,
            services: pet.services,
            description: pet.description,
            images: pet.images ?? null
        })
        logger.info(`${userId} added new pet: ${JSON.stringify(data)}`);
        return data;
    }
        logger.info(`Failed to validate user: ${JSON.stringify(userId)}`);
        return null;
}

async function removePet(userId, petId){
    try{ 
        const data = await petDAO.deletePet(userId, petId);
        return data;
    }
    catch(error){
        logger.info(`Pet not found or does not belong to user ${userId}: ${petId}`);
        return null;
    }
}

// createPet("2", {type: "bird", name: "wing", services: ["catches food", "keeps animals away"], description: "something", images: [] })
// removePet("u#C8E1W", "c_moQ")

module.exports = {
    createPet,
    removePet
}