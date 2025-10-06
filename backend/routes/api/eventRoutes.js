const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../../util/jwt');

const eventController = require('../../controllers/eventController');

router.post('/', authenticateToken, eventController.PostEvent);

router.get('/user/:id', eventController.GetEventsByUser); 

router.get('/:id', eventController.GetEventById);

router.get('/', eventController.GetAllEvents);

router.patch('/admin/:id', authenticateToken, eventController.UpdateEventStatusById);

router.patch('/:id', authenticateToken, eventController.PatchEventById);

router.delete('/:id', authenticateToken, eventController.DeleteEventById);

module.exports = router;