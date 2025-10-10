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

//view pet by pet id
router.get('/:petId', petController.getPetById);

//view all pets by user
router.get('/user/:id', petController.getPetsByUser); 

module.exports = router;