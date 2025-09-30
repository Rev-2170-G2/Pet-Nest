const express = require('express');
const router = express.Router();
const petController = require('../../controllers/petController');
const {validatePetData} = require('../../util/petValidation');
const { authenticateToken } = require('../../util/jwt');

//create
router.post('/', authenticateToken, validatePetData, petController.createPet);

//update
// router.patch('/:petId', authenticateToken, petController.updatePet);

//delete
router.post('/:petId', authenticateToken, petController.deletePet);


module.exports = router;