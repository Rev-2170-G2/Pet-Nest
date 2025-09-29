const express = require('express');
const router = express.Router();

const eventController = require('../../controllers/eventController');

router.post('/', eventController.PostEvent);

router.get('/', eventController.GetAllEvents);

router.get('/:id', eventController.GetEventById);

module.exports = router;