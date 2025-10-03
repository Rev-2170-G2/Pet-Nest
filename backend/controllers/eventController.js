const eventService = require('../services/eventService');
const { validateEvent } = require('../util/eventValidation');

/**
 * should call the service layer method to persist an event
 * 
 * @param {JSON} req object containing the request information to be parsed
 * @param {JSON} res object to be manipulated and sent back to client
 */
async function PostEvent(req, res) { 
    if (validateEvent(req.body)) { 
        const pk = req.user.id;
        // const pk = 'u#xbNX9';
        const { name, description, date, location, photos } = req.body;
        const data = await eventService.postEvent({name, description, date, location, photos, pk});
        if (data) {
            res.status(201).json({message: 'Event created', data});
        } else {
            res.status(400).json({message: 'Invalid event'});
        }
    } else {
        res.status(400).json({message: 'event validation failed'});
    }
}

/**
 * should call the service layer method to retrieve a list of all events
 * 
 * @param {JSON} req object containing request information
 * @param {JSON} res object to be manipulated and sent back to client
 */
async function GetAllEvents(req, res) { 
    const data = await eventService.getAllEvents();
    if (data) {
        res.status(200).json({message: 'Events found', data});
    } else {
        res.status(400).json({message: 'No event found'});
    }
}

/**
 * should call the service layer method for retrieving an event by its id 
 * 
 * @param {JSON} req object containing the id to be parsed
 * @param {JSON} res object to be manipulated and sent back to client
 */
async function GetEventById(req, res) { 
    const id = req.params.id;
    const data = await eventService.getEventById(id);
    if (data) {
        res.status(200).json({message: 'Event found ', data});
    } else { 
        res.status(400).json({message: 'No event found'});
    }
}

/**
 * should call the service layer method for retrieving events by user who posted
 * 
 * @param {JSON} req object containing the id to be parsed
 * @param {JSON} res object to be manipulated and sent back to client
 */
async function GetEventsByUser(req, res) {
    const id = req.params.id;
    const status = req.query.status && typeof req.query.status == 'string' ? req.query.status : null;
    const data = await eventService.getEventsByUser(id, status);
    if (data) {
        res.status(200).json({message: 'Events found ', data});
    } else { 
        res.status(400).json({message: 'No events found'});
    }
}

/**
 * should call the service layer method for patching events by the id
 * 
 * @param {*} req object containing the id to be parsed
 * @param {*} res object to be manipulated and sent back to client
 */
async function PatchEventById(req, res) { 
    const event = req.body;
    const id = req.params.id;
    const pk = req.user.id;
    const data = await eventService.patchEventById(id, pk, event);
    if (data) {
        res.status(200).json({message: 'Event patched', data});
    } else {
        res.status(400).json({message: 'Patch failed'});
    }
}

module.exports = {
    PostEvent,
    GetAllEvents,
    GetEventById,
    GetEventsByUser,
    PatchEventById,
}