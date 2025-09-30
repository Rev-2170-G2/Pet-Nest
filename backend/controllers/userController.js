const express = require('express');
const router = express.Router();
const userService = require('../services/userService');
const { generateToken } = require("../util/jwt");
const { isAdministrator } = require("../util/userValidation");
const { logger } = require("../util/logger");

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

async function DeleteOwnAccount(req, res) {
    const userId = req.user.id.replace('u#', '');

    const user = await userService.getUserById(userId);
    if (!user) {
        return res.status(404).json({error: "User not found."});
    }

    const result = await userService.removeUser(userId);
    if (result.success) {
        return res.status(200).json({message: result.message});
    } else {
        return res.status(500).json({error: result.message});
    }
}

async function DeleteUserAsAdmin(req, res) {
    const requester = req.user;
    const targetUserId = req.params.id;

    if (!requester.admin && requester.admin !== "true") {
        return res.status(403).json({error: "Admin access required."});
    }

    try {
        const targetUser = await userService.getUserById(targetUserId)
        if (!targetUser) {
            return res.status(404).json({error: "Target user not found."});
        }

        if (targetUser.admin) {
            return res.status(403).json({error: "Admins cannot delete other admin accounts"});
        }
        
        const result = await userService.removeUser(targetUserId);

        if (result.success) {
            return res.status(200).json({message: `User ${targetUserId} deleted.`});
        } else {
            return res.status(404).json({error: result.message});
        }
    } catch (err) {
        console.error(`Error deleting user as admin: ${err}`);
        return res.status(500).json({error: "Internal server error."})
    }
}

module.exports = {
    login,
    registerUser,
    DeleteOwnAccount,
    DeleteUserAsAdmin
}