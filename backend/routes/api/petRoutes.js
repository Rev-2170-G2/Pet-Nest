const express = require('express');
const router = express.Router();
const petController = require('../../controllers/petController');
const {validatePetData, validatePetUpdates} = require('../../util/pet/petValidation');
const { authenticateToken } = require('../../util/jwt');

//create
router.post('/', authenticateToken, validatePetData, petController.createPet);

//update
router.patch('/:petId', authenticateToken, validatePetUpdates, petController.updatePet);

//delete
router.delete('/:petId', authenticateToken, petController.deletePet);

// view all pet services
router.get('/', petController.getAllPetServices);

module.exports = router;