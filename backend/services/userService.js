const userDAO = require("../repositories/userDAO");
const { logger } = require('../util/logger');

async function removeUser(userId) {
    try {
        const result = await userDAO.deleteUser(userId);

        if (result) {
            logger.info(`User ${userId} deleted successfully.`);
            return {success: true, message: "User deleted successfully."};
        } else {
            logger.warn(`User ${userId} not found or could not be deleted.`);
            return {success: false, message: "User not found or could not be deleted."};
        }
    } catch (err) {
        logger.error(`Error deleting user ${userId}: ${err}`);
        return {success: false, message: "Error occurred while deleting user."};
    }
}

module.exports = {
    removeUser
};