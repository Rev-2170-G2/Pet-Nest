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

module.exports = {
    login,
    registerUser,
}