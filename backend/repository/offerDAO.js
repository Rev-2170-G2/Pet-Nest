require("dotenv").config();
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand, QueryCommand, UpdateCommand } = require("@aws-sdk/lib-dynamodb");
const { logger } = require("../util/logger");

const client = new DynamoDBClient({region: 'us-east-1'});
const documentClient = DynamoDBDocumentClient.from(client);

const TableName = process.env.TableName || 'PetNest';

async function createOffer(offer) {
    const command = new PutCommand({
        TableName,
        Item: offer
    });
    try {
        await documentClient.send(command);
        logger.info(`Offer created: ${JSON.stringify(offer)}`);
        return offer;
    } catch (err) { 
        logger.error(`Error creating offer: ${err}`);
        return null;
    }
}

module.exports = {
  createOffer
};