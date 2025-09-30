const userDAO = require('../repository/userDAO');
const { isValidUsernamePasswordAndEmail, createFormattedUserProfile } = require('../util/userValidation');
const { logger }  = require('../util/logger');
const bcrypt = require('bcrypt'); 


async function registerUser (user) {
    const { username, password, fullName, email } = user;

    try {
        if(user && await isValidUsernamePasswordAndEmail(username, password, email)) {
            const formattedUser = await createFormattedUserProfile(username, password, fullName, email);
            const data = await userDAO.registerUser(formattedUser);
            logger.info({message: `Result data from registerUser in userService: ${data}`})
            return formattedUser;
        }
    } catch (error) {
        console.error(`Error in registerUser in userService: ${error}`);
    }
    return null;
}


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
    registerUser,
    validateLogin,
    removeUser
}
