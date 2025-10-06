require("dotenv").config();
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, UpdateCommand, PutCommand, ScanCommand, QueryCommand, DeleteCommand } = require('@aws-sdk/lib-dynamodb');
const { logger } = require('../util/logger');

const client = new DynamoDBClient({region: 'us-east-1'});
const documentClient = DynamoDBDocumentClient.from(client);

const TableName = process.env.TableName || 'pet_nest';
const IndexName = process.env.IndexName || 'events-by-id-status-index';

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
        Item: event,
    });
    try {
        const data = await documentClient.send(command);
        logger.info(`PUT command to database complete | eventDAO | createEvent | data: ${JSON.stringify(data.Items)}`);
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
        IndexName,
        FilterExpression: "begins_with(#id, :id)",
        ExpressionAttributeNames: {"#id" : "id"},
        ExpressionAttributeValues: {":id": 'e'}
    });
    try {
        const data = await documentClient.send(command);
        logger.info(`SCAN command to database complete | eventDAO | findAllEvents | data: ${JSON.stringify(data.Items)}`);
        return data.Items.length > 0 ? data.Items : null;
    } catch (err) {
        logger.error(`Error in eventDAO | findAllEvents | error: ${err}`);
        return null
    }
}

/**
 * should attempt to find a specific event by its id 
 * 
 * @param {string} id with which to be searched
 * @returns the found event or null
 */
async function findEventById(id) {
    const command = new QueryCommand({ 
        TableName,
        IndexName,
        KeyConditionExpression: `id = :id`,
        ExpressionAttributeValues: {':id': id},
    });
    try {
        const data = await documentClient.send(command);
        logger.info(`QUERY command to database complete | eventDAO | findEventById | data: ${JSON.stringify(data.Items)}`);
        return data.Items;
    } catch (err) {
        logger.error(`Error in eventDAO | findEventById | error: ${err}`);
        return null;
    }
}

/**
 * should attempt to find a list of events pertaining to a user
 * 
 * @param {string} pk of the user to search for
 * @returns 
 */
async function findEventsByUser(pk, status) {
    let options = {
        TableName,
        KeyConditionExpression: `PK = :pk AND begins_with(SK, :sk)`,
    };
    if (status) {
        options.FilterExpression = '#status = :status',
        options.ExpressionAttributeNames = {
            '#status': 'status'
        },
        options.ExpressionAttributeValues = {
            ':pk': pk,
            ':sk': 'EVENT#',
            ':status': status
        }
    } else {
        options.ExpressionAttributeValues = {
            ':pk': pk,
            ':sk': 'EVENT#'
        }
    }
    const command = new QueryCommand(options);
    try {
        const data = await documentClient.send(command);
        logger.info(`QUERY command to database complete | eventDAO | findEventsByUser | data: ${JSON.stringify(data.Items)}`);
        return data.Items.length > 0 ? data.Items : null;
    } catch (err) { 
        logger.error(`Error in eventDAO | findEventsByUser | error: ${err}`);
        return null;
    }
}

/**
 * should attempt to patch an item by its primary key
 * 
 * @param {string} id of the event object
 * @param {string} pk of the currently logged in user
 * @param {JSON} event to patch with
 * @returns the updated item or null
 */
async function patchEventById(id, pk, event) { 
    const command = new UpdateCommand({
        TableName,
        Key: { PK : pk, SK: `EVENT#${id}` },
        UpdateExpression: 'SET #name = :name, #description = :description, #location = :location, #date = :date, #photos = :photos',
        ExpressionAttributeNames: {
            '#name' : 'name',
            '#description' : 'description',
            '#location' : 'location',
            '#date' : 'date',
            '#photos' : 'photos'
        },
        ExpressionAttributeValues: {
            ':name' : event.name,
            ':description' : event.description,
            ':location' : event.location,
            ':date' : event.date,
            ':photos' : event.photos
        },
        ConditionExpression: "attribute_exists(PK) AND attribute_exists(SK)",
        ReturnValues: 'ALL_NEW'
    });

    try {
        const data = await documentClient.send(command);
        logger.info(`UPDATE command to database complete | eventDAO | patchEventById | data: ${JSON.stringify(data.Items)}`);
        return data.Attributes;
    } catch (err) { 
        logger.error(`Error in eventDAO | patchEventById | error: ${JSON.stringify(err)}`);
        return null;
    }
}

async function removeEventById(id, pk) { 
    const command = new DeleteCommand({ 
        TableName,
        Key: {
            PK: pk,
            SK: `EVENT#${id}`,
        },
        ReturnValues : 'ALL_OLD'
    });

    try { 
        const data = await documentClient.send(command);
        logger.info(`DELETE command to database complete | eventDAO | removeEventById | data: ${JSON.stringify(data.Items)}`);
        return data.Attributes;
    } catch (err) { 
        logger.error(`Error in eventDAO | removeEventById | error: ${JSON.stringify(err)}`);
        return null
    }
}

/**
 * should attempt to find a specific evevnt by its id 
 * 
 * @param {string} PK with which to serve as Key
 * @param {string} SK with which to serve as Key
 * @param {string} status with which to update
 * @returns the metadata object confirming success or null
 */
const updateEventApprovalById = async (PK, SK, status) => {
    const command = new UpdateCommand({
        TableName,
        Key: {
            PK,
            SK
        },
        UpdateExpression: "SET #status = :statusUpdate",
        ExpressionAttributeNames: {
            "#status": "status",
        },
        ExpressionAttributeValues: {
            ":statusUpdate": status,
        },
        ReturnValues: "ALL_NEW",
    });

    try {
        const data = await documentClient.send(command);
        logger.info(`Data from updateEventStatusById in eventDAO: ${JSON.stringify(data)}`);
        return data;
    } catch (err) {
        logger.error(`Error in updateEventStatusById in eventDAO: ${err}`);
    }
    return null;
}


module.exports = {
    createEvent,
    findAllEvents,
    findEventById,
    findEventsByUser,
    patchEventById,
    removeEventById,
    updateEventApprovalById,
}