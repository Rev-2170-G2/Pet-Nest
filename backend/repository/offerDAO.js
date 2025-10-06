require("dotenv").config();
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, UpdateCommand, ScanCommand, GetCommand, QueryCommand } = require("@aws-sdk/lib-dynamodb");
const { logger } = require("../util/logger");

const client = new DynamoDBClient({region: 'us-east-1'});
const documentClient = DynamoDBDocumentClient.from(client);

const TableName = process.env.TableName || 'pet_nest';

async function addOffer(PK, SK, offer) {
    try {
        const command = new UpdateCommand({
            TableName,
            Key: { PK, SK },
            UpdateExpression: "SET offers = list_append(if_not_exists(offers, :emptyList), :newOffer)",
            ExpressionAttributeValues: {
                ":newOffer": [offer],
                ":emptyList": []
            },
            ReturnValues: "ALL_NEW"
        });

        const data = await documentClient.send(command);
        return data.Attributes;
    } catch (err) {
        logger.error("Error adding offer:", err);
        return null;
    }
}

async function removeOfferBySender(PK, SK, offerId, senderPK) {
    try {
        const data = await documentClient.send(new GetCommand({ TableName, Key: { PK, SK } }));
        if (!data.Item || !Array.isArray(data.Item.offers)) return null;

        const exists = data.Item.offers.some(o => o.id === offerId && o.requesterPK === senderPK);
        if (!exists) return null;

        const filteredOffers = data.Item.offers.filter(o => o.id !== offerId);
        const updateCommand = new UpdateCommand({
            TableName,
            Key: { PK, SK },
            UpdateExpression: "SET offers = :offers",
            ExpressionAttributeValues: { ":offers": filteredOffers },
            ReturnValues: "ALL_NEW"
        });

        const updated = await documentClient.send(updateCommand);
        return updated.Attributes;
    } catch (err) {
        logger.error("Error removing offer:", err);
        return null;
    }
}

async function getOffersByEntity(PK, SK) {
    try {
        const data = await documentClient.send(new GetCommand({ TableName, Key: { PK, SK } }));
        return data.Item?.offers ?? [];
    } catch (err) {
        logger.error("Error fetching offers for entity:", err);
        return [];
    }
}

async function getOffersSentByUser(userId) {
    try {
        const data = await documentClient.send(new ScanCommand({ TableName }));
        const offersSent = [];
        data.Items.forEach(item => {
            if (Array.isArray(item.offers)) {
                item.offers.forEach(o => {
                    if (o.requesterPK === userId) offersSent.push({ ...o, entityId: item.SK });
                });
            }
        });
        return offersSent;
    } catch (err) {
        logger.error("Error fetching offers sent by user:", err);
        return [];
    }
}

async function getEntity(PK, SK) {
    try {
        const data = await documentClient.send(new GetCommand({ TableName, Key: { PK, SK } }));
        return data.Item ?? null;
    } catch (err) {
        logger.error("Error fetching entity:", err);
        return null;
    }
}

module.exports = {
    addOffer,
    removeOfferBySender,
    getOffersByEntity,
    getOffersSentByUser,
    getEntity
};