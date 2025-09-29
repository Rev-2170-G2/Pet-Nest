const express = require('express');
const router = express.Router();
const petController = require('../../controllers/petController');

router.post('/', validatePetData, petController.createPet);



//validation
//check if pet attributes are not empty
function validatePetData(req, res, next){
    const {type, name, description, services} = req.body.pet;

    if(!type || !name || !description || !services){
        return res.status(400).json({message: "Missing fields: ", data: req.body.pet});
    }
    next();
}

module.exports = router;