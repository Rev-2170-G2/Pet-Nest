const petDAO = require("../repository/petDAO");
const { nanoid } = require('nanoid');
const {logger} = require('../util/logger')

async function createPet(userId, pet){
    //check if userId exists, then add Pet
    if(userId){
        const data = await petDAO.addPet(userId, {
            id: nanoid(5),
            type: pet.type,
            name: pet.name,
            services: pet.services,
            description: pet.description,
            images: pet.images ?? null
        })
        logger.info(`${userId} added new pet: ${JSON.stringify(data)}`);
        return data;
    }
        logger.info(`Failed to validate user: ${JSON.stringify(userId)}`);
        return null;
}

// createPet("2", {type: "bird", name: "wing", services: ["catches food", "keeps animals away"], description: "something", images: ["https://th.bing.com/th/id/OIP.r5FMxsn2tzXVBqRG1KbZ9gHaJ4?w=126&h=180&c=7&r=0&o=7&pid=1.7&rm=3", "https://th.bing.com/th/id/OIP.O3U1p-OOC_c4o7QWZj82ZQHaGg?w=190&h=180&c=7&r=0&o=7&pid=1.7&rm=3"] })

module.exports = {
    createPet,
}