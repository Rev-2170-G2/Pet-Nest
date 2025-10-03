require("dotenv").config();
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, UpdateCommand, PutCommand, ScanCommand, QueryCommand } = require('@aws-sdk/lib-dynamodb');
const { logger } = require('../util/logger');

const client = new DynamoDBClient({region: 'us-east-1'});
const documentClient = DynamoDBDocumentClient.from(client);

const TableName = process.env.TableName || 'pet_nest';

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
        logger.info(`PUT command to database complete | eventDAO | createEvent | data: ${JSON.stringify(data)}`);
        return data;
    } catch (err) { 
        logger.error(`Error in eventDAO | createEvent | error: ${err}`);
        return null;
    }
}

/**
 * should retrieve a list of all event objects 
 *
 * @returns the retrieved data or null
 */
async function findAllEvents() {
    const command = new ScanCommand({
        TableName,
        FilterExpression: '#entity = :entity',
        ExpressionAttributeNames: {'#entity' : 'entity'},
        ExpressionAttributeValues: {':entity' : 'EVENT'}
    });
    try {
        const data = await documentClient.send(command);
        logger.info(`SCAN command to database complete | eventDAO | findAllEvents | data: ${JSON.stringify(data)}`);
        return data;
    } catch (err) {
        logger.error(`Error in eventDAO | findAllEvents | error: ${err}`);
        return null
    }
}

/**
 * should attempt to find a specific evevnt by its id 
 * 
 * @param {string} id with which to be searched
 * @returns the found event or null
 */
async function findEventById(id) {
    const command = new QueryCommand({ 
        TableName,
        IndexName: 'gsi-1',
        KeyConditionExpression: `pk = :pk`,
        ExpressionAttributeValues: {':pk': 'e' + id},
    });
    try {
        const data = await documentClient.send(command);
        logger.info(`QUERY command to database complete | eventDAO | findEventById | data: ${JSON.stringify(data)}`);
        return data;
    } catch (err) {
        logger.error(`Error in eventDAO | findEventById | error: ${err}`);
        return null;
    }
}

/**
 * should attempt to find a list of events pertaining to 
 * 
 * @param {string} id 
 * @returns 
 */
async function findEventsByUser(id) {
    const command = new QueryCommand({
        TableName,
        KeyConditionExpression: `pk = :pk AND begins_with(sk, :sk)`,
        ExpressionAttributeValues: {
            ':pk': id,
            ':sk': 'EVENT#'
        }
    })
    try {
        const data = await documentClient.send(command);
        logger.info(`QUERY command to database complete | eventDAO | findEventsByUser | data: ${JSON.stringify(data)}`);
        return data;
    } catch (err) { 
        logger.error(`Error in eventDAO | findEventsByUser | error: ${err}`);
        return null;
    }
}

module.exports = {
    createEvent,
    findAllEvents,
    findEventById,
    findEventsByUser,
}