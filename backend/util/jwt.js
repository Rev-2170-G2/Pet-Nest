const jwt = require('jsonwebtoken');
const { logger } = require('./logger');

// should probably be changed
const secretKey = 'my-secret-key';

async function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(400).json({message: "Access denied"});
    } else { 
        const user = decodeJWT(token);
        if (user) {
            req.user = user;
            next();
        } else { 
            return res.status(401).json({message: 'Bad JWT'});
        }
    }
}

function decodeJWT(token) {
    try { 
        const user = jwt.verify(token, secretKey);
        return user;
    } catch (err) {
        logger.error(err);
        return null;
    }
}

module.exports = { 
    authenticateToken
}