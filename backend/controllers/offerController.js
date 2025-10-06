const offerService = require("../services/offerService");
const { logger } = require("../util/logger");

async function createOffer(req, res) {
    logger.info({message: `Incoming offerController createOffer request: ${JSON.stringify(req.body)}`});
    
    try {
        const user = req.user;
        const userPK = user.id;
        const offer = await offerService.createOffer(req.body, userPK);
        if (!offer) {
            return res.status(400).json({message: "Failed to create offer. Check requester/requested IDs."});
        }

        return res.status(201).json({message: "Offer created.", offer});
    } catch (err) {
        logger.error(`Error creating offer: ${err}`);
        return res.status(500).json({error: `Failed to create offer: ${err.message}`});
    }
}

module.exports = {
    createOffer
};