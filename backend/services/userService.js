const userDAO = require('../repository/userDAO');
const { isValidUsernamePasswordAndEmail, createFormattedUserProfile } = require('../util/userValidation');
const { logger }  = require('../util/logger');
const bcrypt = require('bcrypt'); 


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
        const pk = userId.startsWith("u#") ? userId : `u#${userId}`;
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