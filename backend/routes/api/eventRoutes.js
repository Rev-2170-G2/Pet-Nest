const express = require('express');
const router = express.Router();

const eventController = require('../../controllers/eventController');

router.post('/', eventController.PostEvent);

router.get('/', eventController.GetAllEvents);

router.get('/:id', eventController.GetEventById);

router.get('/user/:id', eventController.GetEventsByUser);

router.patch('/admin/:id', eventController.UpdateEventStatusById);

module.exports = router;