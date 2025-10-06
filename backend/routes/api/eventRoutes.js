const express = require('express');
const router = express.Router();

const eventController = require('../../controllers/eventController');

router.post('/', eventController.PostEvent);

router.get('/user', eventController.GetEventsByUser); //more specific routes first due to how Express reads routes 

router.get('/:id', eventController.GetEventById);

router.get('/', eventController.GetAllEvents);

router.patch('/admin/:id', eventController.UpdateEventStatusById);

module.exports = router;