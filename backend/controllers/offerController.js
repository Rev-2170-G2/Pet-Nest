const offerService = require("../services/offerService");
const { logger } = require("../util/logger");

async function createOffer(req, res) {
    logger.info({message: `Incoming offerController createOffer request: ${JSON.stringify(req.body)}`});

    const {petId, petOwnerId, services, description} = req.body;
    const requesterId = req.user.id;

    if (!petId || !petOwnerId || !services) {
        return res.status(400).json({error: "Missing required field(s): petId, petOwnerId, services"});
    }

    try {
        const offer = await offerService.requestService(petOwnerId, petId, requesterId, services, description);
        if (!offer) {
            return res.status(400).json({error: "Failed to create offer. Pet or service may not exist."});
        }
        return res.status(201).json({message: "Offer created", offer});
    } catch (err) {
        logger.error(`Error creating offer: ${err}`);
        return res.status(500).json({error: "Internal server error"});
    }
}

module.exports = {
    createOffer
};