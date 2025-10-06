require("dotenv").config();
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, UpdateCommand, GetCommand } = require("@aws-sdk/lib-dynamodb");
const { logger } = require("../util/logger");

const client = new DynamoDBClient({region: 'us-east-1'});
const documentClient = DynamoDBDocumentClient.from(client);

const TableName = process.env.TableName || 'PetNest';

async function getItem(PK, SK) {
    const command = new GetCommand({TableName, Key: { PK, SK }});
    try {
        const {Item} = await documentClient.send(command);
        return Item || null;
    } catch (err) {
        logger.error(`Error fetching item PK:${PK} SK:${SK} | ${err}`);
        return null;
    }
}

async function updateOffers(PK, SK, field, offerRequest) {
    const command = new UpdateCommand({
        TableName,
        Key: {PK, SK},
        UpdateExpression: `SET ${field} = list_append(if_not_exists(${field}, :empty_list), :offer)`,
        ExpressionAttributeValues: {
        ":offer": [offerRequest],
        ":empty_list": []
        },
        ReturnValues: "ALL_NEW"
    });

    try {
        const data = await documentClient.send(command);
        logger.info(`Updated ${field} for PK:${PK} SK:${SK} | Data: ${JSON.stringify(data)}`);
        return data.Attributes;
    } catch (err) {
        logger.error(`Error updating ${field} for PK:${PK} SK:${SK} | ${err}`);
        return null;
    }
}

module.exports = {
    getItem,
    updateOffers
};