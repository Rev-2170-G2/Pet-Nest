const eventService = require('../services/eventService');

/**
 * should call the service layer method to persist an event
 * 
 * @param {*} req object containing the request information to be parsed
 * @param {*} res object to be manipulated and sent back to client
 */
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

/**
 * should call the service layer method to retrieve a list of all events
 * 
 * @param {*} req object containing request information
 * @param {*} res object to be manipulated and sent back to client
 */
async function GetAllEvents(req, res) { 
    const data = await eventService.getAllEvents();
    if (data) {
        res.status(200).json({message: 'Events found', data});
    } else {
        res.status(400).json({message: 'No event found'});
    }
}

function validatePostEvent(event) {
    return (event.name && event.description && event.date && event.location);
}

module.exports = {
    PostEvent,
    GetAllEvents,
}