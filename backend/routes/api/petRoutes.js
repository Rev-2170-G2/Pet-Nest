const express = require('express');
const router = express.Router();
const petController = require('../../controllers/petController');
const {validatePetData} = require('../../util/petValidation');
const { authenticateToken } = require('../../util/jwt');

router.post('/', authenticateToken, validatePetData, petController.createPet);
router.post('/:petId', authenticateToken, petController.removePet);

module.exports = router;