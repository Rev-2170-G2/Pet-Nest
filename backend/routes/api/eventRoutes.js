const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../../util/jwt');

const eventController = require('../../controllers/eventController');

router.post('/', authenticateToken, eventController.PostEvent);

router.get('/user', eventController.GetEventsByUser); //more specific routes first due to how Express reads routes 

router.get('/:id', eventController.GetEventById);

router.get('/', eventController.GetAllEvents);

router.patch('/admins/:id', eventController.UpdateEventStatusById);

router.patch('/:id', authenticateToken, eventController.PatchEventById);

router.delete('/:id', authenticateToken, eventController.DeleteEventById);

module.exports = router;