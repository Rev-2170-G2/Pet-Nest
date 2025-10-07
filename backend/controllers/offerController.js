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
            logger.info(`${userId} attempted to create an invalid offer: ${JSON.stringify(req.body)}`);
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
    const senderId = req.user.id;
    const {ownerId, entityId, offerId} = req.params;

    try {
        const deleted = await offerService.deleteOffer(senderId, ownerId, entityId, offerId);
        if (!deleted) {
            logger.info(`${senderId} failed to delete offer ${offerId} on entity ${entityId}`);
            return res.status(404).json({message: `Offer ${offerId} not found or not allowed.`});
        }

        logger.info(`${senderId} deleted offer ${offerId} from entity ${entityId}`);
        return res.status(200).json({message: `Offer ${offerId} deleted`, data: deleted});
    } catch (err) {
        logger.error(`Error deleting offer ${offerId} by user ${senderId}: ${err}`);
        return res.status(500).json({message: "Server error."});
    }
}

/**
 * should call the service layer to retrieve offers for the specified entity, ensuring user is authorized
 * 
 * @param {JSON} req object containing user info and entity params
 * @param {JSON} res object to be manipulated and sent back to client
 */
async function getOffersForEntity(req, res) {
    const userId = req.user.id;
    const {ownerId, entityId} = req.params;

    if (userId.split('#')[1] !== ownerId) {
        logger.info(`${userId} attempted to view offers for owner ${ownerId}`);
        return res.status(403).json({message: "Forbidden: you cannot view these offers."});
    }

    try {
        const offers = await offerService.getOffersForEntity(ownerId, entityId);
        return res.status(200).json({message: "Offers retrieved", data: offers});
    } catch (err) {
        logger.error(`Error retrieving offers for entity ${entityId}: ${err}`);
        return res.status(500).json({message: "Server error."});
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
 * should call the service layer to update the status of an offer if the user owns it
 * 
 * @param {JSON} req object containing offerId in params and entityId and status in body
 * @param {JSON} res object to be manipulated and sent back to client
 */
const updateOfferStatus = async (req, res) => {
    const {offerId} = req.params;
    const {entityId, status} = req.body;
    const userId = req.user.id;

    if (!offerId || !entityId || !status) {
        return res.status(400).json({message: "Offer ID, entity ID, and status are required"});
    }

    const updatedOffer = await offerService.updateOfferStatus(userId, entityId, offerId, status);
    if (!updatedOffer) {
        return res.status(404).json({message: "Offer not found or unauthorized"});
    }

    return res.status(200).json({message: `Offer ${status}`, offer: updatedOffer});
};

module.exports = {
    createOffer,
    deleteOffer,
    getOffersForEntity,
    getOffersSentByUser,
    updateOfferStatus
};