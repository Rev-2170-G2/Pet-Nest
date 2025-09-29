const petService = require('../services/petService');

const createPet = async (req, res) => { 
    const {userId, pet} = req.body;

    const data = await petService.createPet(userId, pet);
    if(data){
        return res.status(201).json({message: `Created pet: `, data: pet});
    }
    return res.status(400).json({message: "Pet not created: ", data: pet});
}

module.exports = {
    createPet,
}