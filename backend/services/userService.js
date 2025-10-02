const userDAO = require('../repository/userDAO');
const { isValidUsernamePasswordAndEmail, createFormattedUserProfile } = require('../util/userValidation');
const { logger }  = require('../util/logger');
const bcrypt = require('bcrypt'); 

/**
 * should call the userDAO method to persist a user and return the persisted data
 *
 * takes in the user object from controller layer
 * @param {JSON} user object to be sent to the DAO
 * @returns the persisted data or null
 */
async function registerUser (user) {
    const { username, password, fullName, email, admin } = user;

    try {
        if(user && await isValidUsernamePasswordAndEmail(username, password, email)) {
            const formattedUser = await createFormattedUserProfile(username, password, fullName, email, admin);
            const data = await userDAO.registerUser(formattedUser);
            logger.info({message: `Result data from registerUser in userService: ${JSON.stringify(data)}`})
            return data;
        }
    } catch (error) {
        console.error(`Error in registerUser in userService: ${error}`);
    }
    return null;
}

/**
 * should call the userDAO method to verify login information and return the persisted data
 *
 * takes in the username and string object from controller layer
 * @param {JSON} username string to be be sent to retrieve user object
 * @param {JSON} password string to be verified against user object from DAO
 * @returns the persisted data or null
 */
const validateLogin = async (username, password) => {
    try {
        const user = await userDAO.getUserByUsername(username);
        const isValid = !user ? null : await bcrypt.compare(password, user.password);

        if (user && isValid) {
            logger.info(`Returned data from validateLogin in userService: ${JSON.stringify(user)}`);
            return user;
        } else {
            logger.warn(`Attempt to validate username and/or password failed for: ${JSON.stringify(username)}`);         
        }
    } catch (err) {
        logger.error(`Error in validateLogin in userService: ${err}`); 
    }
    return null;
}

/**
 * should call the userDAO method to verify removed user is the same as requester 
 *
 * takes in the uuserId and user object from controller layer
 * @param {JSON} userId string from req.users
 * @param {JSON} requester object stored on req.users to compare to id from userDAO
 * @returns the metdata object confirming success
 */
async function removeUser(userId, requester) {
    try {
        const pk = userId.startsWith("u#") ? userId : `u#${userId}`;
        const userItems = await userDAO.getUserItems(pk);
        if (!userItems || userItems.length === 0) {
            return {success: false, message: "User not found."};
        }

        const targetUser = userItems.find(item => item.SK.startsWith("USER#"));

        if (targetUser.admin && targetUser.PK !== requester.id) {
            return {success: false, message: "Admins cannot be deleted."};
        }

        const result = await userDAO.deleteUser(pk);
        return result;
    } catch (err) {
        logger.error(`Error deleting user ${userId}: ${err}`);
        return {success: false, message: "Internal server error."};
    }
}

module.exports = {
    registerUser,
    validateLogin,
    removeUser
}