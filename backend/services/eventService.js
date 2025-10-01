const eventDAO = require('../repository/eventDAO');
const { logger } = require('../util/logger');
const { nanoid } = require('nanoid');
const { validateEvent } = require('../util/eventValidation');


/**
 * should call the eventDAO method to persist events and return the persisted data
 *
 * takes in the event object from controller layer
 * @param {JSON} event object to be sent to the DAO
 * @returns the persisted data or null
 */
async function postEvent(event) {
    if (validateEvent(event)) {
        const id = 'e' + nanoid(5);
        const entity = 'EVENT';
        const PK = event.pk;
        const SK = entity + '#' + id;
        const photos = !event.photos ? [] : event.photos;
        const status = 'pending'; // all events should be set to pending upon creation
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
            logger.info(`Creating new event | eventService | postEvent | data: ${JSON.stringify(data)}`);
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
        logger.info(`Events found | eventService | getAllEvents | data: ${JSON.stringify(data)}`);
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
    if (id && id.split('')[0] === 'e') {
        const data = await eventDAO.findEventById(id);
        if (data) {
            logger.info(`Event found | eventService | getEventById | data: ${JSON.stringify(data)}`);
            return data;
        } else { 
            logger.info(`Failed to find any event | eventService | getEventById`);
            return null;
        }
    } else { 
        logger.info(`Invalid id provided | eventService | getEventById | id: ${id}`);
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
    const pk = 'u#' + id;
    const data = await eventDAO.findEventsByUser(pk);
    if (data) {
        logger.info(`Event found | eventService | getEventsByUser | data: ${JSON.stringify(data)}`);
        return data;
    } else { 
        logger.info(`Failed to find any event | eventService | getEventsByUser`);
        return null;
    }
}


module.exports = {
    postEvent,
    getAllEvents,
    getEventById,
    getEventsByUser,
}