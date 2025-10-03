const bcrypt = require('bcrypt');
bcrypt.compare = jest.fn();

const userService = require('../../services/userService.js');
const userDAO = require('../../repository/userDAO.js');
const { isValidUsernamePasswordAndEmail, createFormattedUserProfile } = require('../../util/userValidation');

jest.mock('../../repository/userDAO');
jest.mock('../../util/userValidation');
jest.mock('bcrypt');

describe('userService version 1 suite', () => {
    afterEach(() => {
        jest.clearAllMocks();
    })

    describe('registerUser', () => {
        const dummyUser = {
            username: 'user1',
            password: 'password1234',
            fullName: 'Test User',
            email: 'test@example.com',
            admin: false,
        }

        test('positive testing - should register a valid user', async () => {
            isValidUsernamePasswordAndEmail.mockResolvedValue(true);
            createFormattedUserProfile.mockResolvedValue({...dummyUser, password: 'hashedPassword'});
            userDAO.registerUser.mockResolvedValue({$metadata: { httpStatusCode: 200}});

            const result = await userService.registerUser(dummyUser);

            expect(isValidUsernamePasswordAndEmail).toHaveBeenCalledWith(dummyUser.username, dummyUser.password, dummyUser.email);
            expect(createFormattedUserProfile).toHaveBeenCalledWith(dummyUser.username, dummyUser.password, dummyUser.fullName, dummyUser.email, dummyUser.admin);
            expect(userDAO.registerUser).toHaveBeenCalled();
            expect(result).toEqual({$metadata:{httpStatusCode: 200}});
        });

        test('negative testing - should return null if validation fails', async () => {
            isValidUsernamePasswordAndEmail.mockResolvedValue(false);
            
            const result = await userService.registerUser(dummyUser);

            expect(result).toBeNull();
            expect(userDAO.registerUser).not.toHaveBeenCalled();
        });
    });

    
    describe('validateLogin', () => {
        const dummyUser = {
            username: 'user1',
            password: 'hashedPassword',
            fullName: 'Test User',
            email: 'test@example.com',
            admin: false,
        };

        test('positive testing - should return userwhen credentials are valid', async () => {
            userDAO.getUserByUsername.mockResolvedValue(dummyUser);
            bcrypt.compare.mockResolvedValue(true);

            const result = await userService.validateLogin('user1', 'password1234');

            expect(userDAO.getUserByUsername).toHaveBeenCalledWith('user1');
            expect(bcrypt.compare).toHaveBeenCalledWith('password1234', dummyUser.password);
            expect(result).toEqual(dummyUser);
        });

        test('negative testing - should return null when user not found', async () => {
            userDAO.getUserByUsername.mockResolvedValue(null);

            const result = await userService.validateLogin('missingUser', 'password1234');

            expect(result).toBeNull;
        });

        test('negative testing - should return null when password is invalid', async () => {
            userDAO.getUserByUsername.mockResolvedValue(dummyUser);
            bcrypt.compare.mockResolvedValue(false);

            const result = await userService.validateLogin('user1', 'wrongPassword');

            expect(result).toBeNull();
        });
    });
});