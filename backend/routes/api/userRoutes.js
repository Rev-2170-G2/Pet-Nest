const express = require('express');
const router = express.Router();

const userController = require('../../controllers/userController');
const { authenticateToken } = require('../../util/jwt');

router.post('/login', userController.login);

router.post('/admin/register', authenticateToken, userController.registerUser);

router.post('/register', userController.registerUser);


module.exports = router;