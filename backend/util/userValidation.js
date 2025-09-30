const userDAO = require('../repository/userDAO');
const bcrypt = require('bcrypt'); 
const { nanoid } = require('nanoid')
const validator = require("email-validator");
const { logger }  = require('../util/logger')

async function isValidUsername (username) {
    logger.info(`Username validation check.`);   
    if (username) {
        const currentUser = await userDAO.getUserByUsername(username);
        logger.info({message: `Username validation successful: ${!currentUser}`});   
        return !currentUser;
    }
    return null;
}

// TODO: add more pw validation checks
function isValidPassword (password) {
    logger.info(`Password validation check.`);   
    if (password) { 
        logger.info(`Password validation successful`);   
        return true;  
    }
    return null;
}

function isValidEmail(email) {
    logger.info(`Email validation check.`);   
    if (validator.validate(email)) { 
        logger.info(`Email validation successful`);   
        return true;  
    }
    return null;
}

async function isValidUsernamePasswordAndEmail(username, password, email){
    return await isValidUsername(username) && isValidPassword(password) && isValidEmail(email);
}

async function createFormattedUserProfile (username, userPass, fullName, email, admin = false) {
    try {
        const entity = "USER";
        const idNumber = nanoid(5);
        const createdAt =  getTimestamp();

        const PK = "u#" + idNumber;
        const SK = entity + "#" + idNumber;
        const salt = 12;
        const password = await bcrypt.hash(userPass, salt);
        
        const formattedUser = {
            PK, 
            SK,
            entity,
            createdAt,
            username,
            password,
            fullName,
            email,
            admin,
        };
        return formattedUser;
    } catch (err) {
        logger.error(`Error in createdFormattedUser in userValidation: ${err}`);
    }
    return null;
}

async function isAdministrator (username) {
    const currentUser = await userDAO.getUserByUsername(username);
    logger.info({message: 'from isAdministrator in userValidation', user: currentUser});
    const isAnAdministrator = currentUser.admin === true;
    return isAnAdministrator;
}

function getTimestamp () {
    const rawTimestamp = Date.now(); 
    const dateObject = new Date(rawTimestamp);
    const readableTimestamp = dateObject.toLocaleString();
    return readableTimestamp;
}

module.exports = {
    isValidUsername,
    isValidPassword,
    isValidEmail,
    isValidUsernamePasswordAndEmail,
    createFormattedUserProfile,
    isAdministrator,
}