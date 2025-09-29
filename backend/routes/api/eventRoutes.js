const express = require('express');
const router = express.Router();

const eventController = require('../../controllers/eventController');

router.post('/', eventController.PostEvent);

router.get('/', eventController.GetEvents);

router.get('/');

module.exports = router;