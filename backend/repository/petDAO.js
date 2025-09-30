const { DynamoDBClient} = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand, DeleteCommand} = require("@aws-sdk/lib-dynamodb")
const {logger} = require('../util/logger');

const client = new DynamoDBClient({region: "us-east-1"});
const documentClient = DynamoDBDocumentClient.from(client);

const TableName = "pet-nest";

// link userId with new pet
async function createPet(userId, pet){
    const command = new PutCommand({
        TableName,
        Item: {
            PK: userId,
            SK: `PET#${pet.id}`,
            ...pet,
            reviews: 0,
            eventsCompleted: 0
        }
    })

    try{
        await documentClient.send(command);
        logger.info(`Pet ${pet.name} added for user ${userId}`);
        return pet;
    }
    catch(error){
        console.log(error);
        return null;
    }
}

// delete pet by petId linked to userId
async function deletePet(userId, petId){
    const command = new DeleteCommand({
    TableName,
        Key: {
            PK: userId,
            SK: `PET#${petId}`,
        },
        ReturnValues : "ALL_OLD"
    })

    try{
        const data = await documentClient.send(command);
        if(data.Attributes){
            logger.info(`Pet ${petId} deleted for user ${userId}`);
        }else{
            logger.info(`Pet ${petId} not found for user ${userId}`);
        }
        return data.Attributes;
    }
    catch(error){
        console.log(error);
        return null;
    }
}

// createPet("1", {id: "1", name: "rex", type: "dog", services: ["dance", "sing"], description: "not sure what this is for", reviews: 5, eventsCompleted: 10})
// deletePet("C8ERW","KBKPG")

module.exports = {
    createPet,
    deletePet
}