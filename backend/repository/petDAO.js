const { DynamoDBClient} = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand} = require("@aws-sdk/lib-dynamodb")
const {logger} = require('../util/logger');

const client = new DynamoDBClient({region: "us-east-1"});
const documentClient = DynamoDBDocumentClient.from(client);

const TableName = "pet-nest";

// link userId with new pet
async function addPet(userId, pet){
    const command = new PutCommand({
        TableName,
        Item: {
            PK: `u#${userId}`,
            SK: `PET#${pet.id}`,
            ...pet
        }
    })

    try{
        await documentClient.send(command);
        logger.info(`PET ${pet.name} added for ${userId}`);
        return pet;
    }
    catch(error){
        console.log(error);
        return null;
    }
}

// addPet("1", {id: "3", name: "rex", type: "dog", services: ["dance", "sing"], description: "not sure what this is for", reviews: 5, eventsCompleted: 10})

module.exports = {
    addPet
}