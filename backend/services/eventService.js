const eventDAO = require('../repository/eventDAO');
const { logger } = require('../util/logger');
const { nanoid } = requier('nanoid');


/**
 * should call the eventDAO method to persist events and return the persisted data
 *
 * takes in the event object from controller layer
 * @param {JSON} event object to be sent to the DAO
 * @returns the persisted data or null
 */
async function postEvent(event) {
    const id = nanoid();
    const entity = 'EVENT';
    const sk = entity + '#' + id;
    if (validateEvent(event)) {
        const data = await eventDAO.createEvent({
            //unsure how to obtain pk at this time
            pk: 'u#12345',
            sk,
            id,
            entity,
            name: event.name,
            description: event.description,
            location: event.location,
            date: event.date,
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
    const nameResult = event.name.length > 0;
    const descResult = event.description.length > 0;
    const dateResult = event.date.length > 0;
    const locationResult = event.location.length > 0;
    return (nameResult && descResult && dateResult && locationResult);
}


module.exports = {
    postEvent,
}