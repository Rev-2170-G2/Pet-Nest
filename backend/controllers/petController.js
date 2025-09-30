const petService = require('../services/petService');
const { logger } = require("../util/logger");

const createPet = async (req, res) => {
    logger.info({message: `Incoming petController createPet request: ${JSON.stringify(req.body)}`});
    const userId = req.user.id;
    const pet = req.body;

    const data = await petService.createPet(userId, pet);
    if(data){
        return res.status(201).json({message: `Created pet: `, data: pet});
    }
    return res.status(400).json({message: "Pet not created: ", data: pet});
}

const deletePet = async (req, res) => {
    logger.info({message: `Incoming petController removePet request`});
    const userId = req.user.id;
    const petId = req.params.petId;

    const data = await petService.deletePet(userId, petId);
    if(data){
        return res.status(200).json({message: `Removed pet: ${petId}`});
    }
    return res.status(400).json({message: "Unable to remove pet: ", data: petId});
}

module.exports = {
    createPet,
    deletePet
}