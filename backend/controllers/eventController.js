const eventService = require('../services/eventService');

async function PostEvent(req, res) { 
    if (validatePostEvent(req.body)) { 
        // subject to change: pk can either be passed in from the frontend or obtained from the token
        const { name, description, date, location, pk } = req.body;
        const data = await eventService.postEvent({name, description, date, location, pk});
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
    return (event.name && event.description && event.date && event.location);
}

module.exports = {
    PostEvent,
}