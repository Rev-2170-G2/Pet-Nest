const eventDAO = require('../repository/eventDAO');
const { logger } = require('../util/logger');
const { nanoid } = require('nanoid');


/**
 * should call the eventDAO method to persist events and return the persisted data
 *
 * takes in the event object from controller layer
 * @param {JSON} event object to be sent to the DAO
 * @returns the persisted data or null
 */
async function postEvent(event) {
    const id = nanoid(5);
    const entity = 'EVENT';
    const PK = event.pk;
    const SK = entity + '#' + id;
    const photos = !event.photos ? [] : event.photos;
    const status = 'pending';
    if (validateEvent(event)) {
        const data = await eventDAO.createEvent({
            PK,
            SK,
            id,
            entity,
            name: event.name,
            description: event.description,
            location: event.location,
            date: event.date,
            photos: photos,
            status: status
        });

        if (data) { 
            logger.info(`Creating new event | eventService | postEvent | data: ${data}`);
            return data;
        } else { 
            logger.info(`Failed to create event | eventService | postEvent`);
            return null;
        }
    } else { 
        logger.info(`Failed to validate event | eventService | postEvent | error: ${JSON.stringify(event)}`);
        return null;
    }
}

/**
 * should call the eventDAO method for retrieving all events from db
 * 
 * @returns the retrieved events or null
 */
async function getAllEvents() {
    const data = await eventDAO.findAllEvents();
    if (data) {
        logger.info(`Events found | eventService | getAllEvents | data: ${data}`);
        return data;
    } else { 
        logger.info(`Failed to find events | eventService | getAllEvents`);
        return null;
    }
}

/**
 * should call the DAO method for retrieving a single event by its id
 * 
 * @param {string} id with which to search
 * @returns the event retrieved or null
 */
async function getEventById(id) {
    const data = await eventDAO.findEventById(id);
    if (data) {
        logger.info(`Event found | eventService | getEventById | data: ${data}`);
        return data;
    } else { 
        logger.info(`Failed to find any event | eventService | getEventById`);
        return null;
    }
}

/**
 * should call the DAO method for retrieving a list of events by user id
 * 
 * @param {string} id with which to query 
 * @returns the retrieved data or null
 */
async function getEventsByUser(id) {
    const data = await eventDAO.findEventsByUser(id);
    if (data) {
        logger.info(`Event found | eventService | getEventsByUser | data: ${data}`);
        return data;
    } else { 
        logger.info(`Failed to find any event | eventService | getEventsByUser`);
        return null;
    }
}


function validateEvent(event) {
    const nameResult = event.name.length > 0;
    const descResult = event.description.length > 0;
    const dateResult = event.date.length > 0;
    const locationResult = event.location.length > 0;
    return (nameResult && descResult && dateResult && locationResult);
}


module.exports = {
    postEvent,
    getAllEvents,
    getEventById,
    getEventsByUser,
}