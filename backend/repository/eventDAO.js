const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, UpdateCommand, PutCommand, ScanCommand, QueryCommand } = require('@aws-sdk/lib-dynamodb');
const { logger } = require('../util/logger');

const client = new DynamoDBClient({region: 'us-east-1'});
const documentClient = DynamoDBDocumentClient.from(client);

const TableName = 'pet_nest';

/**
 * should persist an event to the database
 *
 * takes in the event object from eventService
 * @param {JSON} event object to persist
 * @returns the persisted data or null
 */
async function createEvent(event) { 
    const command = new PutCommand({
        TableName,
        Item: event
    });
    try {
        const data = await documentClient.send(command);
        logger.info(`PUT command to database complete | eventDAO | createEvent | data: ${data}`);
        return data;
    } catch (err) { 
        logger.error(`Error in eventDAO | createEvent | error: ${err}`);
        return null;
    }
}

module.exports = {
    createEvent,
}