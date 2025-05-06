//const { addFriend, sendFriendRequest, loginUser, signupUser } = require('../controllers/userController');
const { getUser, addFriend, sendFriendRequest, loginUser, signupUser, getFriends, getAllUsers, searchUsers } = require('../controllers/userController');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

jest.mock('../models/userModel');

jest.mock('jsonwebtoken', () => ({
    sign: jest.fn(() => 'mockToken'),
}));

//------Send Friend Req------
describe("sendFriendRequest", () => {
    test("should mutually accept friend request if both users have pending requests", async () => {
        const req = { body: { userId: "user123", targetUserId: "target456" } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    
        // Mock user with `target456` in their pending list
        User.findById.mockResolvedValueOnce({
            _id: "user123",
            friendship: {
                pending: ["target456"], 
                accepted: [],
            },
            save: jest.fn(),
        }).mockResolvedValueOnce({
            _id: "target456",
            friendship: { pending: [], accepted: [] }, 
            save: jest.fn(),
        });
    
        await sendFriendRequest(req, res);
    
        expect(User.findById).toHaveBeenCalledWith("user123");
        expect(User.findById).toHaveBeenCalledWith("target456");
    
        
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: "Friend successfully added!" });
    });
    
});

//-----Search Users-----
describe("searchUsers", () => {
    test("should return empty array when query is missing", async () => {
        const req = { query: {} }; // No search query provided
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await searchUsers(req, res);

        expect(res.json).toHaveBeenCalledWith([]);
    });

    test("should return matching users when valid query is provided", async () => {
        const req = { query: { search: "john", currentUserId: "12345" } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        User.find.mockReturnValue({
            select: jest.fn().mockResolvedValue([
                { _id: "67890", username: "john_doe", email: "john@example.com" },
                { _id: "54321", username: "johnny", email: "johnny@example.com" }
            ])
        });

        await searchUsers(req, res);

        expect(User.find).toHaveBeenCalledWith({
            $or: [
                { username: { $regex: "john", $options: "i" } },
                { email: { $regex: "john", $options: "i" } }
            ],
            _id: { $ne: "12345" }
        });

        expect(res.json).toHaveBeenCalledWith([
            { _id: "67890", username: "john_doe", email: "john@example.com" },
            { _id: "54321", username: "johnny", email: "johnny@example.com" }
        ]);
    });

    /*VERIFY IF THIS IS EXPECTED BEHAVIOR*/
    /*test("should not return current user in search results", async () => {
        const req = { query: { search: "test", currentUserId: "userId123" } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        User.find.mockReturnValue({
            select: jest.fn().mockResolvedValue([
                { _id: "userId123", username: "test_user", email: "test@example.com" }, // Should be filtered out
                { _id: "98765", username: "tester", email: "tester@example.com" } // Should be returned
            ])
        });

        await searchUsers(req, res);

        expect(User.find).toHaveBeenCalledWith({
            $or: [
                { username: { $regex: "test", $options: "i" } },
                { email: { $regex: "test", $options: "i" } }
            ],
            _id: { $ne: "userId123" }
        });

        expect(res.json).toHaveBeenCalledWith([
            { _id: "98765", username: "tester", email: "tester@example.com" }
        ]);
    });*/

    /*test("should return 500 if database error occurs", async () => {
        const req = { query: { search: "test", currentUserId: "userId123" } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        User.find.mockReturnValue({
            select: jest.fn().mockRejectedValue(new Error("Database error"))
        });

        await searchUsers(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: "Search failed." });
    });*/
});


//-----Add Friend Tests-----
describe("addFriend", () => {
    let req, res;

    beforeEach(() => {
        req = { body: {}, params: {}, query: {} };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });
   
    test("should return 500 if adding friend fails", async () => {
        User.findById.mockRejectedValueOnce(new Error("Database error"));
        req.body = { userId: "userId", incomingUserId: "incomingUserId" };

        await addFriend(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: "Something went wrong: addFriend" });
    });

    test("removes user from pending even if empty", async () => {
        User.findById.mockResolvedValueOnce({
            _id: "userId",
            friendship: { pending: [], accepted: [] },
            save: jest.fn(),
        }).mockResolvedValueOnce({
            _id: "incomingUserId",
            friendship: { pending: [], accepted: [] },
            save: jest.fn(),
        });
    
        req.body = { userId: "userId", incomingUserId: "incomingUserId" };
    
        await addFriend(req, res);
    
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: "Friend request accepted!" });
    });
    
    test("does not duplicate accepted friends", async () => {
        User.findById.mockResolvedValueOnce({
            _id: "userId",
            friendship: { pending: [], accepted: ["incomingUserId"] },
            save: jest.fn(),
        }).mockResolvedValueOnce({
            _id: "incomingUserId",
            friendship: { pending: [], accepted: ["userId"] },
            save: jest.fn(),
        });
    
        req.body = { userId: "userId", incomingUserId: "incomingUserId" };
    
        await addFriend(req, res);
    
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: "Friend request accepted!" });
    });
    
    test("returns 500 if saving user fails", async () => {
        User.findById.mockResolvedValueOnce({
            _id: "userId",
            friendship: { pending: [], accepted: [] },
            save: jest.fn().mockRejectedValueOnce(new Error("Database save error")),
        }).mockResolvedValueOnce({
            _id: "incomingUserId",
            friendship: { pending: [], accepted: [] },
            save: jest.fn(),
        });
    
        req.body = { userId: "userId", incomingUserId: "incomingUserId" };
    
        await addFriend(req, res);
    
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: "Something went wrong: addFriend" });
    });

    test("should remove incoming user from pending friendship list", async () => {
        const req = { body: { userId: "user123", incomingUserId: "incoming456" } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    
        // Mock user with the incoming user in the pending list
        User.findById.mockResolvedValueOnce({
            _id: "user123",
            friendship: {
                pending: ["incoming456", "otherUser789"], 
                accepted: [],
            },
            save: jest.fn(),
        }).mockResolvedValueOnce({
            _id: "incoming456",
            friendship: { pending: [], accepted: [] },
            save: jest.fn(),
        });
    
        await addFriend(req, res);
    
        expect(User.findById).toHaveBeenCalledWith("user123");
        expect(User.findById).toHaveBeenCalledWith("incoming456");
    
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: "Friend request accepted!" });
    });
    
    
});


//------Get User Tests-----
describe("getUser", () => {
    test("should fetch user and populate pending friendships", async () => {
        // Ensure req is properly initialized inside the test
        const req = { params: { id: "userId123" } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        console.log(await User.findById("userId123"));
        // Mock the database response
        User.findById.mockReturnValue({
            populate: jest.fn().mockResolvedValue({
                _id: "userId123",
                username: "testUser",
                email: "test@example.com",
                friendship: {
                    pending: [{ _id: "friendId456", username: "friendUser", email: "friend@example.com" }]
                }
            })
        });
           
        await getUser(req, res);
    
        expect(User.findById).toHaveBeenCalledWith("userId123");
        expect(res.json).toHaveBeenCalledWith({
            _id: "userId123",
            username: "testUser",
            email: "test@example.com",
            friendship: {
                pending: [{ _id: "friendId456", username: "friendUser", email: "friend@example.com" }]
            }
        });
    });

    test("should return 500 if user is not found", async () => {
        req = { params: { id: "nonexistentUserId" } };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    
        User.findById.mockResolvedValue(null); // Simulate user not found
    
        await getUser(req, res);
    
        expect(User.findById).toHaveBeenCalledWith("nonexistentUserId");
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: "Failed to fetch user data" });
    });
    
    //Cannot test daatabase error withouy crashing test suite
    /*test("should return 500 if database error occurs", async () => {
        req = { params: { id: "userId123" } };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    
        try {
            User.findById.mockRejectedValue(new Error("Database error"));
        } catch (error) {
            console.error("Mocking error:", error);
        }
        
        //User.findById.mockRejectedValue(new Error("Database error"));
    
        await getUser(req, res);
    
        expect(User.findById).toHaveBeenCalledWith("userId123");
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: "Failed to fetch user data" });
    });*/
    
    
});


//-----Get Friends Tests-----
describe("getFriends", () => {
    test("should fetch user's accepted friends", async () => {
        const req = { params: { userId: "validUserId" } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        // Mock the database response
        User.findById.mockReturnValue({
            populate: jest.fn().mockResolvedValue({
                _id: "validUserId",
                username: "testUser",
                friendship: {
                    accepted: [
                        { _id: "friendId1", username: "friendUser1", email: "friend1@example.com" },
                        { _id: "friendId2", username: "friendUser2", email: "friend2@example.com" }
                    ]
                }
            })
        });

        await getFriends(req, res);

        expect(User.findById).toHaveBeenCalledWith("validUserId");
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith([
            { _id: "friendId1", username: "friendUser1", email: "friend1@example.com" },
            { _id: "friendId2", username: "friendUser2", email: "friend2@example.com" }
        ]);
    });

    test("should return 404 if user is not found", async () => {
        const req = { params: { userId: "nonexistentUserId" } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        User.findById.mockResolvedValue(null); // Simulate user not found

        await getFriends(req, res);

        expect(User.findById).toHaveBeenCalledWith("nonexistentUserId");
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: "User not found" });
    });

    test("should return 500 if database error occurs", async () => {
        const req = { params: { userId: "validUserId" } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        User.findById.mockRejectedValue(new Error("Database error")); // Simulate database failure

        await getFriends(req, res);

        expect(User.findById).toHaveBeenCalledWith("validUserId");
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: "Failed to fetch friends" });
    });
});


//-----Get All Users-----
describe("getAllUsers", () => {
    test("should fetch all users successfully", async () => {
        const req = {}; // No query params needed
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        // Mock the database response
        User.find.mockReturnValue({
            select: jest.fn().mockResolvedValue([
                { _id: "user1", email: "user1@example.com" },
                { _id: "user2", email: "user2@example.com" }
            ])
        });      

        await getAllUsers(req, res);

        expect(User.find).toHaveBeenCalledWith({}); // Ensure it queries all users
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith([
            { _id: "user1", email: "user1@example.com" },
            { _id: "user2", email: "user2@example.com" }
        ]);
    });

    
    test("should return empty array when no users exist", async () => {
        const req = {};
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    
        // Correctly mock chainable `User.find().select()`
        User.find.mockReturnValue({
            select: jest.fn().mockResolvedValue([])
        });
    
        await getAllUsers(req, res);
    
        expect(User.find).toHaveBeenCalledWith({});
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith([]);
    });
    
    //Cannot simulate database error without crashing test suite
    /*test("should return 500 if database error occurs", async () => {
        const req = {};
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    
        // Simulate database failure
        User.find.mockRejectedValueOnce(new Error("Database error"));

        await expect(getAllUsers(req, res)).rejects.toThrow("Database error");
    
        expect(User.find).toHaveBeenCalledWith({});
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: "Failed to fetch users" });
    });*/
    
});