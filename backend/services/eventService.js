const eventDAO = require('../repository/eventDAO');
const { logger } = require('../util/logger');


/**
 * should call the eventDAO method to persist events and return the persisted data
 *
 * takes in the event object from controller layer
 * @param {JSON} event object to be sent to the DAO
 * @returns the persisted data or null
 */
async function postEvent(event) { 
    if (validateEvent(event)) {
        const data = await eventDAO.createEvent({
            //some data
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



function validateEvent(event) {
    // should validate all event fields
    return null;
}


module.exports = {
    postEvent,
}