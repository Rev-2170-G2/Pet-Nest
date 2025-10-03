const express = require('express');
const router = express.Router();
const petController = require('../../controllers/petController');
const {validatePetData, validatePetUpdates} = require('../../util/pet/petValidation');

//create
router.post('/', validatePetData, petController.createPet);

//update
router.patch('/:petId', validatePetUpdates, petController.updatePet);

//delete
router.delete('/:petId', petController.deletePet);

module.exports = router;