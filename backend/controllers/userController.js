const express = require('express');
const router = express.Router();
const userService = require('../services/userService');
const { generateToken } = require("../util/jwt");
const { isAdministrator } = require("../util/userValidation");
const { logger } = require("../util/logger");


/**
 * should call the service layer method to persist a user
 * 
 * @param {JSON} req object containing the request information to be parsed
 * @param {JSON} res object to be manipulated and sent back to client
 */
async function registerUser (req, res) {
    logger.info({message: `Incoming userController registerUser request: ${JSON.stringify(req.body)}`});

    try {
        const isAdmin = req.user?.admin === "true" || req.user?.admin === true;

        if (req.body.admin === true && !isAdmin) {
            res.status(400).json({message: "Only administrators can create admin accounts."});
        } else {
            const newUserdata = await userService.registerUser(req.body);
            
            return newUserdata
                ? res.status(201).json({message: "Created user", user: newUserdata})
                : res.status(400).json({message: `Invalid request: user not created. Must contain a unique username, password and valid email.`}); 
        } 
    } catch (error) {
        console.error(`Error in userController registerUser: ${error}`);
    }
};


/**
 * should call the service layer method to login a user
 * 
 * @param {JSON} req object containing the request information to be parsed
 * @param {JSON} res object to be manipulated and sent back to client
 */
async function login (req, res) {
    logger.info({message: `Incoming userController login request: ${JSON.stringify(req.body)}`});

    try {
        const { username, password } = req.body;
        const user = await userService.validateLogin(username, password); // check this
        if (user){
            const payload = { id: user.PK, username: username, admin: user.admin };
            const token = generateToken(payload);
            return res.status(200).json({message: "Successful login", token});
        } else {
            return res.status(401).json({message: `Invalid username and/or password`});  
        }
    } catch (error) {
        console.error(`Error in userController login: ${error}`);
    }
};


/**
 * should call the service layer method to delete their user account
 * 
 * @param {JSON} req object containing the request information to be parsed
 * @param {JSON} res object to be manipulated and sent back to client
 */
async function DeleteOwnAccount(req, res) {
    logger.info({message: `Incoming userController DeleteOwnAccount request: ${JSON.stringify(req.body)}`});
    const userId = req.user.id;
    const result = await userService.removeUser(userId, req.user);

    if (result === true) {
        return res.status(200).json({message: "User deleted successfully."});
    } else if (result === null) {
        return res.status(404).json({error: "User not found."});
    } else {
        return res.status(403).json({error: "Admins cannot be deleted by others."});
    }
}

/**
 * should call the service layer method to delete user (as admin)
 * 
 * @param {JSON} req object containing the request information to be parsed
 * @param {JSON} res object to be manipulated and sent back to client
 */
async function DeleteUserAsAdmin(req, res) {
    logger.info({message: `Incoming userController DeleteUserAsAdmin request: ${JSON.stringify(req.body)}`});
    const requester = req.user;
    const targetUserId = req.params.id;

    if (!requester.admin) {
        return res.status(403).json({error:"Admin access required."});
    }

    if (!targetUserId) {
        return res.status(400).json({error: "User ID is required."});
    }

    const result = await userService.removeUser(targetUserId, requester);

    if (result === true) {
        return res.status(200).json({message: `User ${targetUserId} deleted successfully.`});
    } else if (result === null) {
        return res.status(404).json({error: "User not found."});
    } else {
        return res.status(403).json({error: "Admins cannot be deleted by others."});
    }
}

module.exports = {
    login,
    registerUser,
    DeleteOwnAccount,
    DeleteUserAsAdmin
}