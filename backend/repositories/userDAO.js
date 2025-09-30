const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, QueryCommand, BatchWriteCommand} = require('@aws-sdk/lib-dynamodb');
const { logger } = require('../util/logger');

const client = new DynamoDBClient({region: 'us-east-1'});
const documentClient = DynamoDBDocumentClient.from(client);

const TableName = "PetNest";

async function deleteUser(userId) {
    const pk = `USER#${userId}`;

    try {
        const queryCommand = new QueryCommand({
            TableName,
            KeyConditionExpression: 'PK = :pk',
            ExpressionAttributeValues: {':pk': pk}
        });
        const {Items} = await documentClient.send(queryCommand);

        if (!Items || Items.length === 0) return false;

        const deleteRequests = Items.map(item => ({
            DeleteRequest: {Key: {PK: item.PK, SK: item.SK}}
        }));

        for (let i = 0; i < deleteRequests.length; i += 25) {
            const batch = deleteRequests.slice(i, i + 25);
            await documentClient.send(new BatchWriteCommand({
                RequestItems: {[TableName]: batch}
            }));
        }

        logger.info(`Deleted user ${userId}`);
        return true;
    } catch (err) {
        logger.error(`Failed to delete user ${userId}: ${err}`);
        return false;
    }
}

module.exports = {
    deleteUser
};