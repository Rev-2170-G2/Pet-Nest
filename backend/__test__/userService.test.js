const userService = require('../services/userService');
const userDAO = require('../repository/userDAO');

jest.mock('../repository/userDAO');

describe('testing removeUser and getUserById', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('removeUser Testing', () =>{
        test('should delete user successfully', async () => {
            userDAO.deleteUser.mockResolvedValue(true);

            const result = await userService.removeUser('123');

            expect(result).toEqual({success: true, message: "User deleted successfully."});
            expect(userDAO.deleteUser).toHaveBeenCalledWith('123');
        });

        test('should return failure if user not found', async () => {
            userDAO.deleteUser.mockResolvedValue(false);

            const result = await userService.removeUser('999');

            expect(result).toEqual({success: false, message: "User not found or could not be deleted."});
            expect(userDAO.deleteUser).toHaveBeenCalledWith('999');
        });

        test('should return failure if DAO throws error', async () => {
            userDAO.deleteUser.mockRejectedValue(new Error('Database failure'));

            const result = await userService.removeUser('456');

            expect(result).toEqual({success: false, message: "Error occurred while deleting user."});
            expect(userDAO.deleteUser).toHaveBeenCalledWith('456');
        });   
    });
    

    describe('getUserById Testing', () => {
        test('should return the first user item if found', async () => {
            const mockUser = {
                PK: "u#123",
                SK: "USER#123",
                admin: false,
                username: "testuser"
            };
            
            userDAO.getUserById.mockResolvedValue([mockUser]);

            const result = await userService.getUserById('123');

            expect(userDAO.getUserById).toHaveBeenCalledWith('123');
            expect(result).toEqual(mockUser);
        });

        test('should return null if no user found', async () => {
            userDAO.getUserById.mockResolvedValue([]);

            const result = await userService.getUserById('123');

            expect(userDAO.getUserById).toHaveBeenCalledWith('123');
            expect(result).toBeNull();
        });

        test('should return null if userDAO throws an error', async () => {
            userDAO.getUserById.mockRejectedValue(new Error('Database failure'));

            const result = await userService.getUserById('123');

            expect(result).toBeNull();
        });
    });
});