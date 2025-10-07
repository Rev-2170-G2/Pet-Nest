require("dotenv").config();
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, UpdateCommand, GetCommand, ScanCommand, DeleteCommand } = require("@aws-sdk/lib-dynamodb");
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

async function removeOffer(userId, petId, offerId) {
    // Step 1: Get the PET item
    const getCommand = new GetCommand({
        TableName,
        Key: {PK: userId, SK: `PET#${petId}`},
    });

    try {
        const petData = await documentClient.send(getCommand);
        if (!petData.Item) {
            logger.info(`Pet ${petId} not found for user ${userId}`);
            return null;
        }

        const pet = petData.Item;

        // Step 2: Check if offer exists
        const offerIndex = pet.offers.findIndex(o => o.id === offerId);
        if (offerIndex === -1) {
            logger.info(`Offer ${offerId} not found for pet ${petId}`);
            return null;
        }

        // Step 3: Remove the offer from the array
        pet.offers.splice(offerIndex, 1);

        // Step 4: Update the PET item
        const updateCommand = new UpdateCommand({
            TableName,
            Key: {PK: userId, SK: `PET#${petId}`},
            UpdateExpression: "SET #offers = :offers",
            ExpressionAttributeNames: {"#offers": "offers"},
            ExpressionAttributeValues: {":offers": pet.offers},
            ReturnValues: "ALL_NEW",
        });

        const updatedData = await documentClient.send(updateCommand);
        logger.info(`Offer ${offerId} removed from pet ${petId} for user ${userId}`);
        return updatedData.Attributes;

    } catch (error) {
        logger.error(`Error removing offer ${offerId} | DAO | error: ${error}`);
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
    removeOffer,
    // removeOfferById,
    // removeOfferBySender,
    getOffersSentByUser,
    updateEntityOffers,
    getEntitiesByOwner,
    getEntity
};