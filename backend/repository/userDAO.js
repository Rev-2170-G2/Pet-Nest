const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand, ScanCommand } = require("@aws-sdk/lib-dynamodb");
const { logger } = require("../util/logger");

const client = new DynamoDBClient();
const ddbDocClient = DynamoDBDocumentClient.from(client);
const TableName = process.env.TableName || "pet_nest";

async function registerUser (user) {
    const command = new PutCommand({
        TableName, 
        Item: user,
    });

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
        logger.info(`Data from getUserByUsername in userDAO: ${JSON.stringify(data)}`);
        return data.Items[0];
    } catch (err) {
        logger.error(`Error in getUserByUsername in userDAO: ${err}`);
    }
    return null; 
}

module.exports = {
    registerUser,
    getUserByUsername
}