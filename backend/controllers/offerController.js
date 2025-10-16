const offerService = require("../services/offerService");
const { logger } = require("../util/logger");

/**
 * should calls the service layer to create an offer
 * 
 * @param {JSON} req object containing user info and offer details
 * @param {JSON} res object to be manipulated and sent back to client
 */
async function createOffer(req, res) {
    const userId = req.user.id;

    try {
        const offer = await offerService.createOffer(req.body, userId);
        if (!offer) {
            logger.info(`${userId} attempted to create an invalid offer in createOffer from offerController: ${JSON.stringify(req.body)}`);
            return res.status(400).json({message: "Invalid offer or permission denied."});
        }
        logger.info(`${userId} created new offer: ${JSON.stringify(offer)}`);
        return res.status(201).json({message: "Offer created", data: offer});
    } catch (err) {
        logger.error(`Error creating offer for user ${userId}: ${err}`);
        return res.status(500).json({message: "Server error creating offer."});
    }
}

/**
 * should call the service layer to delete an offer for the given sender and entity
 * 
 * @param {JSON} req object containing sender info and params
 * @param {JSON} res object to be manipulated and sent back to client
 */
async function deleteOffer(req, res) {
    const userId = req.user.id;
    const {petId, offerId} = req.params;

    const result = await offerService.deleteOffer(userId, petId, offerId);

    if (result) {
        res.status(200).json({message: `Offer ${offerId} deleted`, data: result });
    } else {
        res.status(400).json({message: `Failed to delete offer ${offerId}` });
    }
}

/**
 * should call the service layer to retrieve all offers sent by the user
 * 
 * @param {JSON} req object containing user info
 * @param {JSON} res object to be manipulated and sent back to client
 */
async function getOffersSentByUser(req, res) {
    const userId = req.user.id;

    try {
        const offers = await offerService.getOffersSentByUser(userId);
        return res.status(200).json({message: "Offers sent by user retrieved", data: offers});
    } catch (err) {
        logger.error(`Error retrieving offers sent by user ${userId}: ${err}`);
        return res.status(500).json({message: "Server error."});
    }
}

/**
 * should call the service layer to retrieve all offers received by the user
 * 
 * @param {JSON} req object containing user info
 * @param {JSON} res object to be manipulated and sent back to client
 */
async function getAllReceivedOffers(req, res) {
    const userId = req.user.id;
    console.log("userId from getAllReceivedOffers: ", userId)
    try {
        const offers = await offerService.getAllReceivedOffers(userId);
        return res.status(200).json({message: "All received offers retrieved", data: offers});
    } catch (err) {
        logger.error(`Error retrieving received offers for user ${userId}: ${err}`);
        return res.status(500).json({message: "Server error."});
    }
}

/**
 * should call the service layer to update the status of an offer if the user owns it
 * 
 * @param {JSON} req object containing offerId in params and entityId and status in body
 * @param {JSON} res object to be manipulated and sent back to client
 */
const updateOfferStatus = async (req, res) => {
    const { id } = req.params; // offerId
    const {requestedSK, status} = req.body; // requestedSK (prev entityId is PET or EVENT id)
    const userId = req.user.id;

    logger.info("offerController | updateOfferStatus", req.body);
    if (!id|| !requestedSK || !status) {
        return res.status(400).json({message: "Offer ID, entity ID, and status are required"});
    }

    const updatedOffer = await offerService.updateOfferStatus(userId, requestedSK, id, status);
    if (!updatedOffer) {
        return res.status(404).json({message: "Offer not found or unauthorized"});
    }

    return res.status(200).json({message: `Offer ${status}`, offer: updatedOffer});
};

module.exports = {
    createOffer,
    deleteOffer,
    getOffersSentByUser,
    getAllReceivedOffers,
    updateOfferStatus
};