require("dotenv").config();
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, UpdateCommand, GetCommand, ScanCommand } = require("@aws-sdk/lib-dynamodb");
const { logger } = require("../util/logger");

const client = new DynamoDBClient({region: "us-east-1"});
const documentClient = DynamoDBDocumentClient.from(client);
const TableName = process.env.TableName || "pet_nest";

async function addOffer(PK, SK, offer) {
    try {
        const command = new UpdateCommand({
            TableName,
            Key: {PK, SK},
            UpdateExpression: "SET offers = list_append(if_not_exists(offers, :emptyList), :newOffer)",
            ExpressionAttributeValues: {":newOffer": [offer], ":emptyList": []},
            ReturnValues: "ALL_NEW"
        });

        const data = await documentClient.send(command);
        return data.Attributes;
    } catch (err) {
        logger.error(`Error adding offer to ${SK}: ${err}`);
        return null;
    }
}

async function removeOfferBySender(PK, SK, offerId, senderPK) {
    try {
        const {Item} = await documentClient.send(new GetCommand({TableName, Key: {PK, SK}}));
        if (!Item?.offers) return null;

        const exists = Item.offers.some(o => o.id === offerId && o.requesterPK === senderPK);
        if (!exists) return null;

        const updatedOffers = Item.offers.filter(o => o.id !== offerId);
        const updateCmd = new UpdateCommand({
            TableName,
            Key: {PK, SK},
            UpdateExpression: "SET offers = :offers",
            ExpressionAttributeValues: {":offers": updatedOffers},
            ReturnValues: "ALL_NEW"
        });

        const updated = await documentClient.send(updateCmd);
        return updated.Attributes;
    } catch (err) {
        logger.error(`Error removing offer ${offerId} from ${SK}: ${err}`);
        return null;
    }
}

async function getOffersSentByUser(userId) {
    try {
        const {Items} = await documentClient.send(new ScanCommand({TableName}));
        const offersSent = [];

        Items.forEach(item => {
            if (Array.isArray(item.offers)) {
                item.offers.forEach(o => {
                    if (o.requesterPK === userId) offersSent.push({...o, entityId: item.SK});
                });
            }
        });

        return offersSent;
    } catch (err) {
        logger.error(`Error fetching offers sent by user ${userId}: ${err}`);
        return [];
    }
}

async function getEntity(PK, SK) {
    try {
        const {Item} = await documentClient.send(new GetCommand({TableName, Key: {PK, SK}}));
        return Item ?? null;
    } catch (err) {
        logger.error(`Error fetching entity ${SK}: ${err}`);
        return null;
    }
}

async function getEntitiesByOwner(ownerId) {
    const cleanOwnerId = ownerId.startsWith("u#") ? ownerId.slice(2) : ownerId;
    const PK = `u#${cleanOwnerId}`;

    const command = new ScanCommand({
        TableName,
        FilterExpression: "PK = :pk AND (begins_with(SK, :petPrefix) OR begins_with(SK, :eventPrefix))",
        ExpressionAttributeValues: {
            ":pk": PK,
            ":petPrefix": "PET#",
            ":eventPrefix": "EVENT#"
        }
    });

    try {
        const result = await documentClient.send(command);
        return result.Items || [];
    } catch (err) {
        logger.error(`Error scanning entities for ${ownerId}: ${err}`);
        return [];
    }
}

async function updateEntityOffers(PK, SK, updatedOffers) {
    try {
        const command = new UpdateCommand({
            TableName,
            Key: {PK, SK},
            UpdateExpression: "SET offers = :offers",
            ExpressionAttributeValues: {":offers": updatedOffers},
            ReturnValues: "ALL_NEW"
        });

        const result = await documentClient.send(command);
        return result.Attributes;
    } catch (err) {
        logger.error(`Error updating offers for ${SK}: ${err}`);
        return null;
    }
}

module.exports = {
    addOffer,
    removeOfferBySender,
    getOffersSentByUser,
    updateEntityOffers,
    getEntitiesByOwner,
    getEntity
};