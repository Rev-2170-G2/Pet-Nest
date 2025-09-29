const eventService = require('../services/eventService');

async function PostEvent(req, res) { 
    if (validatePostEvent(req.body)) { 
        const {  } = req.body;
        const data = await eventService.postEvent({});
        if (data) {
            res.status(201).json({message: 'Event created', data});
        } else {
            res.status(400).json({message: 'Invalid event'});
        }
    } else {
        res.status(400).json({message: 'event validation failed'})
    }
}

function validatePostEvent(event) {

}

module.exports = {
    PostEvent,
}