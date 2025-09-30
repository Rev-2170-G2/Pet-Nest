const express = require('express');
const router = express.Router();

const userController = require('../../controllers/userController');
const { authenticateToken } = require('../../util/jwt');

router.post('/login', userController.login);

router.post('/register', userController.registerUser);

router.delete('/self', authenticateToken, userController.DeleteOwnAccount);

router.delete('/admin/:id', authenticateToken, userController.DeleteUserAsAdmin);

module.exports = router;