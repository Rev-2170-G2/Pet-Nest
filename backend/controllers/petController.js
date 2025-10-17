const petService = require('../services/petService');
const { logger } = require("../util/logger");

const createPet = async (req, res) => {
    logger.info({message: `Incoming petController createPet request: ${JSON.stringify(req.body)}`});
    const userId = req.user.id;
    const pet = req.body;

    const data = await petService.createPet(userId, pet);
    if(data){
        return res.status(201).json({message: `Created pet`, data: pet});
    }
    return res.status(400).json({message: "Pet not created", data: pet});
}

const updatePet = async (req, res) => {
    logger.info({message: `Incoming petController updatePet request: ${JSON.stringify(req.body)}`});
    const userId = req.user.id;
    const petId = req.params.petId;
    const updates = req.body;

    const data = await petService.updatePet(userId, petId, updates);

    if (data) {
        return res.status(200).json({ message: `Updated pet: ${petId}`, data });
    }

    return res.status(400).json({ message: `Unable to update pet: ${petId}`, data: updates });
};

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

const getAllPetServices = async (req, res) => {
    logger.info({message: `Incoming petController getAllPetServices request`});

    const data = await petService.getAllPetServices();
    if(data){
        return res.status(200).json({ message: "Pet Services found", data });
    }
    return res.status(400).json({message: "No pet services found"});
}

const getPetById = async (req, res) => {
    const petId = req.params.petId;
    logger.info({message: `Incoming petController getPetById request: ${JSON.stringify(petId)}`});
    const data = await petService.getPetById(petId);
    if (data) {
        res.status(200).json({message: 'Pet found', data});
    } else { 
        res.status(400).json({message: 'No pet found'});
    }
}

const getPetsByUser = async (req, res) => {
    const id = req.params.id;
    logger.info({message: `Incoming petController getPetByUser request: ${JSON.stringify(id)}`});
    const data = await petService.getPetsByUser(id);
    if (data) {
        res.status(200).json({message: 'Pets found', data});
    } else { 
        res.status(400).json({message: 'No pet found'});
    }
}

const getPetsByType = async (req, res) => {
    const type = req.params.type;
    logger.info({message: `Incoming petController getPetsByType request: ${JSON.stringify(type)}`});
    const data = await petService.getPetsByType(type);
    if (data) {
        return res.status(200).json({message: 'Pets found', data});
    } else {
        return res.status(404).json({message: `No pets found for type ${type}`});
    }
}

const addReview = async (req, res) => {
  const { petId } = req.params;
  const userId = req.user.id;
  const { rating, reviewText } = req.body;

  try {
    const data = await petService.addPetReview(petId, userId, rating, reviewText);
    res.status(200).json({ message: 'Review added', data });
  } catch (err) {
    res.status(400).json({ message: 'Failed to add review', error: err.message });
  }
};


module.exports = {
    createPet,
    updatePet,
    deletePet,
    getAllPetServices,
    getPetById,
    getPetsByUser,
    getPetsByType,
    addReview
}