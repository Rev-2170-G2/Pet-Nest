const userService = require("../../services/userService");
const userDAO = require("../../repository/userDAO");
const logger = require("../../util/logger"); 

jest.mock("../../repository/userDAO");
jest.mock("../../util/logger");

describe("removeUser testing", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    const requesterUser = {id: "u#user1", admin: false};
    const requesterAdmin = {id: "u#admin1", admin: true};

    const normalUserItems = [
        {PK: "u#user1", SK: "USER#user1", admin: false},
        {PK: "u#user1", SK: "PET#pet1"},
    ];

    const adminUserItems = [
        {PK: "u#admin2", SK: "USER#admin2", admin: true}
    ];

    test("should delete normal user successfully", async () => {
        userDAO.getUserItems.mockResolvedValue(normalUserItems);
        userDAO.deleteUser.mockResolvedValue({success: true, message: "Deleted"});

        const result = await userService.removeUser("u#user1", requesterUser);
        expect(result).toEqual({success: true, message: "Deleted"});
        expect(userDAO.getUserItems).toHaveBeenCalledWith("u#user1");
        expect(userDAO.deleteUser).toHaveBeenCalledWith("u#user1");
    });

    test("should allow admin to delete normal user", async () => {
        userDAO.getUserItems.mockResolvedValue(normalUserItems);
        userDAO.deleteUser.mockResolvedValue({success: true, message: "Deleted"});

        const result = await userService.removeUser("u#user1", requesterAdmin);
        expect(result.success).toBe(true);
        expect(userDAO.deleteUser).toHaveBeenCalledWith("u#user1");
    });

    test("should allow admin to delete self", async () => {
        const adminSelfItems = [
        {PK: "u#admin1", SK: "USER#admin1", admin: true},
        ];
        userDAO.getUserItems.mockResolvedValue(adminSelfItems);
        userDAO.deleteUser.mockResolvedValue({success: true, message: "Deleted"});

        const result = await userService.removeUser("u#admin1", requesterAdmin);
        expect(result.success).toBe(true);
        expect(userDAO.deleteUser).toHaveBeenCalledWith("u#admin1");
    });

    test("should prevent admin from deleting another admin", async () => {
        userDAO.getUserItems.mockResolvedValue(adminUserItems);

        const result = await userService.removeUser("u#admin2", requesterAdmin);
        expect(result).toEqual({success: false, message: "Admins cannot be deleted."});
        expect(userDAO.deleteUser).not.toHaveBeenCalled();
    });

    test("should return not found if user does not exist", async () => {
        userDAO.getUserItems.mockResolvedValue([]);

        const result = await userService.removeUser("u#user", requesterUser);
        expect(result).toEqual({success: false, message: "User not found."});
        expect(userDAO.deleteUser).not.toHaveBeenCalled();
    });

    test("should handle internal server errors", async () => {
        userDAO.getUserItems.mockRejectedValue(new Error("Database failure"));

        const result = await userService.removeUser("u#user1", requesterUser);
        expect(result).toEqual({success: false, message: "Internal server error."});
    });
});
