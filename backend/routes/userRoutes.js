const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const { authenticateToken } = require('../util/jwt');

router.delete('/self', authenticateToken, userController.DeleteOwnAccount);

router.delete('/admin/:id', authenticateToken, userController.DeleteUserAsAdmin);

module.exports = router;