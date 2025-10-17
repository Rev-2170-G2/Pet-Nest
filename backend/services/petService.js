const petDAO = require("../repository/petDAO");
const { nanoid } = require('nanoid');
const {logger} = require('../util/logger');
const { buildPetUpdates } = require('../util/pet/petUpdateBuilder');

async function createPet(userId, pet){
    //check if userId exists(not needed - already checked in middleware)
    if(userId){
        const formattedType = pet.type.charAt(0).toUpperCase() + pet.type.slice(1).toLowerCase();
        const data = await petDAO.createPet(userId, {
            id: 'p' + nanoid(5),
            entity: "PET",
            type: formattedType,
            name: pet.name,
            services: pet.services.map(s => ({
                service: s.service,
                price: s.price
            })),
            description: pet.description,
            photos: pet.photos ?? [],
            location: pet.location ?? null,
            offers: [],
            review: [],

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

async function getPetById(petId) {
    if (petId && petId.split('')[0] === 'p') {
        const data = await petDAO.getPetById(petId);
        if (data) {
            logger.info(`Pet found | petService | getPetById | data: ${JSON.stringify(data)}`);
            return data;
        } else { 
            logger.info(`Failed to find any pet | petService | getPetById`);
            return null;
        }
    } else { 
        logger.info(`Invalid id provided | petService | getPetById | id: ${petId}`);
        return null;
    }
}

async function getPetsByUser(id) {
    const pk = 'u#' + id;
    const data = await petDAO.getPetsByUser(pk);
    if (data) {
        logger.info(`Pets found | petService | getPetsByUser | data: ${JSON.stringify(data)}`);
        return data;
    } else { 
        logger.info(`Failed to find any pet | petService | getPetsByUser`);
        return null;
    }
}

async function getPetsByType(petType) {
    if (petType) {
        const data = await petDAO.getPetsByType(petType);
        if (data) {
            logger.info(`Pet found | petService | getPetsByType | data: ${JSON.stringify(data)}`);
            return data;
        } else { 
            logger.info(`Failed to find any pet | petService | getPetsByType`);
            return null;
        }
    } else { 
        logger.info(`Invalid id provided | petService | getPetsByType | id: ${petType}`);
        return null;
    }
}

async function addPetReview(petId, userId, rating, reviewText) {
  if (!petId || !userId) {
    logger.info("Missing petId or userId for review");
    return null;
  }

  const review = {
    rating,
    reviewText,
    createdAt: new Date().toISOString(),
  };

  try {
    const updatedPet = await petDAO.addPetReview(userId, petId, review);
    return updatedPet;
  } catch (err) {
    logger.info(`Service failed to add review for pet ${petId}: ${err.message}`);
    return null;
  }
}

module.exports = {
    createPet,
    updatePet,
    deletePet,
    getAllPetServices,
    getPetById,
    getPetsByUser,
    getPetsByType,
    addPetReview
}