require("dotenv").config();
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, UpdateCommand, ScanCommand, GetCommand } = require("@aws-sdk/lib-dynamodb");
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

async function removeOfferBySender(PK, entityId, offerId, senderId) {
    const prefixes = ['PET#', 'EVENT#'];
    let entity = null;
    let SK = null;

    for (const prefix of prefixes) {
        const skCandidate = `${prefix}${entityId}`;
        const data = await documentClient.send(new GetCommand({ TableName, Key: { PK, SK: skCandidate } }));
        if (data.Item) {
            entity = data.Item;
            SK = skCandidate;
            break;
        }
    }

    if (!entity || !entity.offers || !Array.isArray(entity.offers)) return null;

    const offerExists = entity.offers.some(o => o.id === offerId && o.requester === senderId);
    if (!offerExists) return null;

    const filteredOffers = entity.offers.filter(o => o.id !== offerId);

    const updateCommand = new UpdateCommand({
        TableName,
        Key: { PK, SK },
        UpdateExpression: "SET offers = :offers",
        ExpressionAttributeValues: { ":offers": filteredOffers },
        ReturnValues: "ALL_NEW"
    });

    const updated = await documentClient.send(updateCommand);
    logger.info(`Offer ${offerId} removed from ${SK} by sender ${senderId}`);
    return updated.Attributes;
}

module.exports = {
    addOffer,
    removeOfferBySender
};