const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../../util/jwt');

const eventController = require('../../controllers/eventController');

router.post('/', authenticateToken, eventController.PostEvent);

router.get('/', eventController.GetAllEvents);

router.get('/:id', eventController.GetEventById);

router.get('/users/:id', eventController.GetEventsByUser);

router.patch('/:id', authenticateToken, eventController.PatchEventById);

router.delete('/:id', authenticateToken, eventController.DeleteEventById);

module.exports = router;