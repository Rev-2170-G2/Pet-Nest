const userService = require('../services/userService');
const userDAO = require('../repositories/userDAO');

jest.mock('../repositories/userDAO');

describe('testing removeUser', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should delete user successfully', async () => {
        userDAO.deleteUser.mockResolvedValue(true);

        const result = await userService.removeUser('123');

        expect(userDAO.deleteUser).toHaveBeenCalledWith('123');
        expect(result.message).toBe("User deleted successfully.");
        expect(result.success).toBe(true);
    });

    test('should return failure if user not found', async () => {
        userDAO.deleteUser.mockResolvedValue(false);

        const result = await userService.removeUser('999');

        expect(userDAO.deleteUser).toHaveBeenCalledWith('999');
        expect(result.message).toBe("User not found or could not be deleted.");
        expect(result.success).toBe(false);
    });

    test('should return failure if DAO throws error', async () => {
        const error = new Error('Database error');
        userDAO.deleteUser.mockRejectedValue(error);

        const result = await userService.removeUser('456');

        expect(userDAO.deleteUser).toHaveBeenCalledWith('456');
        expect(result.message).toBe("Error occurred while deleting user.");
        expect(result.success).toBe(false);
    });

});