const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand, ScanCommand, QueryCommand, BatchWriteCommand } = require("@aws-sdk/lib-dynamodb");
const { logger } = require("../util/logger");

const client = new DynamoDBClient({region: 'us-east-1'}); // Added region
const ddbDocClient = DynamoDBDocumentClient.from(client);
const TableName = "PetNest"; // Ask about table name: pet_services_table

async function registerUser (user) {
    const command = new PutCommand({
        TableName, 
        Item: user,
    })

    try {
        const data = await ddbDocClient.send(command);
        logger.info({message: `Data from registerUser in userDAO ${JSON.stringify(data)}`});
        return data;
    } catch (error) {
        console.error(error);
    }
    return null;
}

const getUserByUsername = async (username) => {
    const command = new ScanCommand({
        TableName,
        FilterExpression: "#username = :username",
        ExpressionAttributeNames: {"#username" : "username"},
        ExpressionAttributeValues: {":username": username}
    })

    try {
        const data = await ddbDocClient.send(command);
        logger.info(`Data from getUserByUsername in userDAO: ${JSON.stringify(data.Items[0])}`);
        return data.Items[0];
    } catch (err) {
        logger.error(`Error in getUserByUsername in userDAO: ${err}`);
    }
    return null; 
}

async function deleteUser(userId) {
    const pk = `u#${userId}`;

    try {
        const queryCommand = new QueryCommand({
            TableName,
            KeyConditionExpression: 'PK = :pk',
            ExpressionAttributeValues: {':pk': pk}
        });
        const {Items} = await ddbDocClient.send(queryCommand);

        if (!Items || Items.length === 0) return false;

        const deleteRequests = Items.map(item => ({
            DeleteRequest: {Key: {PK: item.PK, SK: item.SK}}
        }));

        for (let i = 0; i < deleteRequests.length; i += 25) {
            const batch = deleteRequests.slice(i, i + 25);
            await ddbDocClient.send(new BatchWriteCommand({
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
    registerUser,
    getUserByUsername,
    deleteUser
}