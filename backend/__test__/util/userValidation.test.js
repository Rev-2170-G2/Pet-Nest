const userValidation = require('../../util/userValidation.js');
const userDAO = require('../../repository/userDAO.js');
const validator = require("email-validator");

jest.mock('../../repository/userDAO.js');
jest.mock("email-validator")


describe('isValidUsername version 1 suite', () => {
    test('negative testing - an undefined username is invalid should return false', async () => {
        const invalidUsername = "";
        const result = await userValidation.isValidUsername(invalidUsername);
        expect(result).toBeNull();
    })

    test('positive testing - isValidUsername should invoke userDAO.getUserByUsername once if username is defined', async () => {
        const username = "thisIsMyUsername";
        await userValidation.isValidUsername(username);
        expect(userDAO.getUserByUsername).toHaveBeenCalledTimes(1);
    })

    test('negative testing - a username is not valid if it already exists in the db and should return false', async () => {
        const username = "takenUsername";

        userDAO.getUserByUsername.mockResolvedValue({ username });

        const result = await userValidation.isValidUsername(username);

        expect(userDAO.getUserByUsername).toHaveBeenCalledWith(username);
        expect(result).toBe(false);
    })
})

describe('isValidPassword version 1 suite', () => {
    test('positive testing - a defined password is valid and return true', () => {
        const validPassword = "thisIsValid";
        const result = userValidation.isValidPassword(validPassword);
        expect(result).toBeTruthy();
    })

    test('negative testing - an undefined password is invalid and return false', () => {
        const invalidPassword = "";
        const result = userValidation.isValidPassword(invalidPassword);
        expect(result).toBeNull();
    })
})

describe('isValidEmail version 1 suite', () => {
    beforeEach(() => {
        validator.validate.mockClear();
    });
    
    test('negative testing - an undefined email is invalid and return false', () => {
        const invalidEmail = "";
        const result = userValidation.isValidEmail(invalidEmail);
        expect(result).toBeNull();
    })

    test('positive testing - a defined email should call validator once', () => {
        const email = 'exampleEmail@example.com';
        userValidation.isValidEmail(email);
        expect(validator.validate).toHaveBeenCalledTimes(1);
    })
})

describe('isValidUsernamePasswordAndEmail version 1 suite', () => {
    test('positive testing - invoking isValidUsernamePasswordAndEmail should invoke all three functions: isValidUsername, isValidPassword and isValidEmail with defined inputs', async () => {
        const username = "thisIsMyUsername";    
        const password = "thisIsValid";      
        const email = 'exampleEmail@example.com';

        await userValidation.isValidUsernamePasswordAndEmail(username, password, email)
         
        expect(userValidation.isValidUsername).toHaveBeenCalledTimes(1);
        expect(userValidation.isValidPassword).toHaveBeenCalledTimes(1);
        expect(userValidation.isValidEmail).toHaveBeenCalledTimes(1);
    })
})

describe('createFormattedUserProfile version 1 suite', () => {

});

describe('isAdministrator version 1 suite', () => {
    test('positive testing - should return true if an existing user is an administrator', async () => {
        const adminUser = {
            PK: "u#xYs5J",
            SK: "USER#xYs5J",
            entity: "USER",
            createdAt: "2025/9/29 13:00:03",
            username: "IamAnAdminUser",
            password: "myAdminpassword1234",
            email: "admin@example.com",
            fullName: "Mike H",
            admin: true,
        };

        userDAO.getUserByUsername.mockResolvedValue({ adminUser });

        const result = await userValidation.isAdministrator(adminUser.username);

        expect(userDAO.getUserByUsername).toHaveBeenCalledWith(adminUser.username);
        expect(result).toBe(true);  
    })

    test('negative testing - should return false if a user is not in the db', async () => {
        const unregisteredUsername = "unregisteredUser";
        const result = await userValidation.isAdministrator(unregisteredUsername);
        expect(result).toBe(false);  
    })

    test('negative testing - should return false if a username input is empty', async () => {
        const undefinedUsername = "";
        const result = await userValidation.isAdministrator(undefinedUsername);

        expect(result).toBeFalsy();  
    })

    test('negative testing - should return false if an existing user is not an administrator', async () => {
        const user = {
            PK: "u#xUn6J",
            SK: "USER#xUn6J",
            entity: "USER",
            createdAt: "2025/9/30 11:00:03",
            username: "IamNotAnAdminUser",
            password: "userPassword1234",
            email: "user@example.com",
            fullName: "Joey Smith",
            admin: false,
        };

        userDAO.getUserByUsername.mockResolvedValue({ user });

        const result = await userValidation.isAdministrator(user.username);

        expect(userDAO.getUserByUsername).toHaveBeenCalledWith(user.username);
        expect(result).toBe(false);  
    })
})