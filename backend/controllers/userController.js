const userService = require('../services/userService');

async function DeleteOwnAccount(req, res) {
    const userId = req.user.id;
    const result = await userService.removeUser(userId);

    if (result.success) {
        return res.status(200).json({message: result.message});
    } else {
        return res.status(404).json({error: result.message});
    }
}

async function DeleteUserAsAdmin(req, res) {
    const requester = req.user;
    const targetUserId = req.params.id;

    if (!requester.admin) {
        return res.status(403).json({error: "Admin access required."});
    }

    const result = await userService.removeUser(targetUserId);

    if (result.success) {
        return res.status(200).json({message: `User ${targetUserId} deleted.`});
    } else {
        return res.status(404).json({error: result.message});
    }
}

module.exports = {
    DeleteOwnAccount,
    DeleteUserAsAdmin
};