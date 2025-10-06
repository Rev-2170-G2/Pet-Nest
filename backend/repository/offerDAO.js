require("dotenv").config();
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, UpdateCommand, GetCommand } = require("@aws-sdk/lib-dynamodb");
const { logger } = require("../util/logger");

const client = new DynamoDBClient({region: 'us-east-1'});
const documentClient = DynamoDBDocumentClient.from(client);

const TableName = process.env.TableName || 'PetNest';

async function addOffer(ownerId, entityId, offer) {
    const command = new UpdateCommand({
        TableName,
        Key: { PK: ownerId, SK: entityId },
        UpdateExpression: "SET offers = list_append(if_not_exists(offers, :emptyList), :newOffer)",
        ExpressionAttributeValues: {
            ":newOffer": [offer],
            ":emptyList": []
        },
        ReturnValues: "ALL_NEW"
    });

    const data = await documentClient.send(command);
    return data.Attributes;
}

module.exports = {
    // getItem,
    addOffer
};