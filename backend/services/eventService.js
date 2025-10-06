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
        const status = 'open'; // all events should be set to open upon creation and closed when event is completed
        const approved = false; // boolean to represent whether an admin has approved or denied an event to be displayed
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
            status: status,
            approved: approved
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
async function getEventsByUser(id, status) {
    const pk = 'u#' + id;
    const data = await eventDAO.findEventsByUser(pk, status);
    if (data) {
        logger.info(`Events found | eventService | getEventsByUser | data: ${JSON.stringify(data)}`);
        return data;
    } else { 
        logger.info(`Failed to find any event | eventService | getEventsByUser`);
        return null;
    }
}

/**
 * should call the DAO method for patching an event by it's id
 * 
 * @param {string} id 
 * @param {string} pk to be combined with id for a composite key
 * @param {JSON} event object to update with
 * @returns the patched data or null
 */
async function patchEventById(id, pk, event) {
    // make sure the id matches the correct entity type
    if ((id && id.split('')[0] === 'e') && validateEvent(event)) {
        const data = await eventDAO.patchEventById(id, pk, event);
        if (data) { 
            logger.info(`Event patched | eventService | patchEventById | data: ${JSON.stringify(data)}`);
            return data;
        } else { 
            logger.info(`Failed to patch event | eventService | patchEventById`);
            return null;
        }
    } else { 
        logger.info(`Given id is incorrect/invalid or event validation failed | eventService | patchEventById | id: ${id}`);
        return null;
    }
}

/**
 * shoudld call the DAO method to delete an event by id
 * 
 * @param {string} id 
 * @param {string} pk to combine with id for a composite key
 * @returns unsure
 */
async function deleteEventById (id, pk) {
    if (id && id.split('')[0] === 'e') {
        const data = await eventDAO.removeEventById(id, pk);
        if (data) { 
            logger.info(`Event deleted | eventService | deleteEventById | data: ${JSON.stringify(data)}`);
            return data;
        } else { 
            logger.info(`Failed to delete event | eventService | patchEventById`);
            return null;
        }
    } else { 
        logger.info(`Given id is incorrect/invalid | eventService | deleteEventById | id: ${id}`);
        return null;
    }
}

/**
 * should call the DAO method for updating status of event (approved/denied)
 * 
 * @param {string} PK of event with which to query 
 * @param {string} SK of event with which to query  
 * @param {string} status with which to update attribute
 * @returns the retrieved data or null
 */
async function updateEventApprovalById(eventId, status) {
    try {
        const event = await eventDAO.findEventById(eventId);

        if (!event || event.length === 0) {
            logger.info(`No event found with ID: ${eventId} | eventService | updateEventStatusById`); 
            return null;         
        }

        const data = await eventDAO.updateEventApprovalById(event[0].PK, event[0].SK, status);  
        if (data) {
            logger.info(`Event found | eventService | updateEventStatusById | data: ${data}`);
            return data;
        } else { 
            logger.info(`Failed to find any event | eventService | updateEventStatusById`);
            return null;
        }      
    } catch (error) {
        logger.info(`Error updating event status | eventService | updateEventStatusById | eventId: ${eventId} | error: ${error}`);
        return null;
    } 
}

module.exports = {
    postEvent,
    getAllEvents,
    getEventById,
    getEventsByUser,
    patchEventById,
    deleteEventById,
    updateEventApprovalById,
}