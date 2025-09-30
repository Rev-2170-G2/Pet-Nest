const express = require('express');
const router = express.Router();
const petController = require('../../controllers/petController');
const {validatePetData} = require('../../util/petValidation');

router.post('/', validatePetData, petController.createPet);

module.exports = router;