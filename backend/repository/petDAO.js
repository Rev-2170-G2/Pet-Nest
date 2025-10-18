require("dotenv").config();
const { DynamoDBClient} = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand, UpdateCommand, DeleteCommand, ScanCommand, QueryCommand} = require("@aws-sdk/lib-dynamodb")
const {logger} = require('../util/logger');

const client = new DynamoDBClient({region: "us-east-1"});
const documentClient = DynamoDBDocumentClient.from(client);

const TableName = process.env.TableName;
const PetIndexName = process.env.PetIndexName;
const PetTypeIndexName = process.env.PetTypeIndexName;

// link userId with new pet
async function createPet(userId, pet){
    const command = new PutCommand({
        TableName,
        Item: {
            PK: userId,
            SK: `PET#${pet.id}`,
            ...pet,
            eventsCompleted: 0,
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

// update pet location/photos/services by petId
async function updatePet(userId, petId, updates) {
    const command = new UpdateCommand({
        TableName,
        Key: { PK: userId, SK: `PET#${petId}` },
        UpdateExpression: updates.expression,
        ExpressionAttributeNames: updates.names,
        ExpressionAttributeValues: updates.values,
        ConditionExpression: "attribute_exists(PK) AND attribute_exists(SK)",
        ReturnValues: "ALL_NEW",
    });

    try {
        const data = await documentClient.send(command);
        if (data.Attributes) {
            logger.info(`Pet ${petId} updated for user ${userId}`);
        } else {
            logger.info(`Pet ${petId} not found for user ${userId}`);
        }
        return data.Attributes;
    } catch (error) {
        if (error.name === "ConditionalCheckFailedException") {
            logger.info(`Cannot update pet ${petId}. Pet does not exist for user ${userId}`);
            return null;
        }
        console.error(error);
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

// allows guests to view ALL available pet services
async function getAllPetServices(){
    const command = new ScanCommand({
        TableName,
        FilterExpression: "begins_with(SK, :pet)",
        ExpressionAttributeValues: {
            ":pet": "PET#"
        }
    })

    try{
        const data = await documentClient.send(command);
        if(data){
            logger.info(`(petDAO) Pet services found`);
        }else{
            logger.info(`(petDAO) No pet services found`);
        }
        return data;
    }
    catch(error){
        console.log(error);
        return null;
    }
}

// get pet details by pet id
async function getPetById(petId) {
    const command = new QueryCommand({ 
        TableName,
        IndexName: PetIndexName,
        KeyConditionExpression: `id = :id`,
        ExpressionAttributeValues: {':id': petId},
    });
    try {
        const data = await documentClient.send(command);
        logger.info(`QUERY command to database complete | petDAO | getPetById | data: ${JSON.stringify(data.Items)}`);
        return data.Items;
    } catch (err) {
        logger.error(`Error in petDAO | getPetById | error: ${err}`);
        return null;
    }
}

// get pets by user id
async function getPetsByUser(pk) {
    const command = new QueryCommand({
        TableName,
        KeyConditionExpression: "PK = :pk AND begins_with(SK, :sk)",
        ExpressionAttributeValues: { ":pk": pk, ":sk": "PET#" },
    });

    try {
        const data = await documentClient.send(command);
        logger.info(`QUERY command to database complete | petDAO | getPetsByUser | data: ${JSON.stringify(data.Items)}`);
        return data.Items.length > 0 ? data.Items : null;
    } catch (err) { 
        logger.error(`Error in petDAO | getPetsByUser | error: ${err}`);
        return null;
    }
}

// get pets by type (ex .DOG, CAT, BIRD)
async function getPetsByType(petType) {
    const command = new QueryCommand({
    TableName,
    IndexName: PetTypeIndexName,
    KeyConditionExpression: '#type = :type',
        ExpressionAttributeNames: { '#type': 'type', },
    ExpressionAttributeValues: { ':type': petType },
    });

    try {
        const data = await documentClient.send(command);
        logger.info(`QUERY command to database complete | petDAO | getPetsByType | data: ${JSON.stringify(data.Items)}`);
        return data.Items;
    } catch (err) {
        logger.error(`Error in petDAO | getPetsByType | error: ${err}`);
        return null;
    }
}

async function addPetReview(userId, petId, review) {
  try {
    const command = new UpdateCommand({
      TableName,
      Key: { PK: userId, SK: `PET#${petId}` }, 
      UpdateExpression: "SET review = list_append(if_not_exists(review, :empty), :newReview)",
      ExpressionAttributeValues: {
        ":newReview": [review],
        ":empty": [],
      },
      ReturnValues: "ALL_NEW",
    });

    const data = await documentClient.send(command);
    logger.info(`Review added for pet ${petId}: ${JSON.stringify(review)}`);
    return data.Attributes;
  } catch (err) {
    logger.error(`Failed to add review for pet ${petId}: ${err.message}`);
    throw err;
  }
}

module.exports = {
    createPet,
    updatePet,
    deletePet,
    getAllPetServices,
    getPetById,
    getPetsByUser,
    getPetsByType,
    addPetReview
}
