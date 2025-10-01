const express = require('express');
const router = express.Router();
const petController = require('../../controllers/petController');
const {validatePetData} = require('../../util/petValidation');
const { authenticateToken } = require('../../util/jwt');

//create
router.post('/', validatePetData, petController.createPet);

//update
// router.patch('/:petId', petController.updatePet);

//delete
router.post('/:petId', petController.deletePet);


module.exports = router;