const { loginUser, signupUser, sendFriendRequest} = require('./userController');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

// Mock the User model
jest.mock('../models/userModel');

// Mock the jwt.sign function
jest.mock('jsonwebtoken', () => ({
    sign: jest.fn(() => 'mockToken'),
}));

describe('User Controller Tests', () => {
    let req, res;

    beforeEach(() => {
        req = { body: {}, params: {}, query: {} };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });

    // Test for loginUser function
    test('should log in a user and return 200 with token', async () => {
        // Mock User.login to resolve with a user object
        User.login.mockResolvedValue({ _id: 'mockUserId', email: 'test@example.com' });

        // Set up the request body
        req.body = { email: 'test@example.com', password: 'password123' };

        // Call the loginUser function
        await loginUser(req, res);

        // Assertions
        expect(User.login).toHaveBeenCalledWith('test@example.com', 'password123');
        expect(jwt.sign).toHaveBeenCalledWith({ _id: 'mockUserId' }, process.env.SECRET, { expiresIn: '3d' });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            email: 'test@example.com',
            token: 'mockToken',
            _id: 'mockUserId',
        });
    });

    test('should return 400 if login fails', async () => {
        // Mock User.login to reject with an error
        User.login.mockRejectedValue(new Error('Invalid credentials'));

        // Set up the request body
        req.body = { email: 'test@example.com', password: 'wrongpassword' };

        // Call the loginUser function
        await loginUser(req, res);

        // Assertions
        expect(User.login).toHaveBeenCalledWith('test@example.com', 'wrongpassword');
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Invalid credentials' });
    });

    // Test for signupUser function
    test('should sign up a user and return 200 with token', async () => {
        // Mock User.signup to resolve with a user object
        User.signup = jest.fn().mockResolvedValue({ _id: 'mockUserId', email: 'test@example.com' });

        // Set up the request body
        req.body = { email: 'test@example.com', password: 'password123' };

        // Call the signupUser function
        await signupUser(req, res);

        // Assertions
        expect(User.signup).toHaveBeenCalledWith('test@example.com', 'password123');
        expect(jwt.sign).toHaveBeenCalledWith({ _id: 'mockUserId' }, process.env.SECRET, { expiresIn: '3d' });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            email: 'test@example.com',
            token: 'mockToken',
            _id: 'mockUserId',
        });
    });
    
    test('should return 400 if signup fails', async () => {
        // Mock User.signup to reject with an error
        User.signup = jest.fn().mockRejectedValue(new Error('Email already in use'));

        // Set up the request body
        req.body = { email: 'test@example.com', password: 'password123' };

        // Call the signupUser function
        await signupUser(req, res);

        // Assertions
        expect(User.signup).toHaveBeenCalledWith('test@example.com', 'password123');
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Email already in use' });
    });

    // Test for sendFriendRequest function
    test('should return 400 if friend request is already sent', async () => {
        // Mock User.findById to return user and target with pending requests
        User.findById = jest.fn()
            .mockResolvedValueOnce({ _id: 'userId', friendship: { pending: [] } }) // User
            .mockResolvedValueOnce({ _id: 'targetUserId', friendship: { pending: ['userId'] } }); // Target

        req.body = { userId: 'userId', targetUserId: 'targetUserId' };

        // Call the sendFriendRequest function
        await sendFriendRequest(req, res);

        // Assertions
        expect(User.findById).toHaveBeenCalledWith('userId');
        expect(User.findById).toHaveBeenCalledWith('targetUserId');
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Friend request already sent' });
    });

    test('should accept a mutual friend request and return 200', async () => { //This test does not work, please try to fix it if possible.
        // Mock User.findById to return user and target with mutual pending requests
        User.findById = jest.fn()
            .mockResolvedValueOnce({
                _id: 'userId',
                friendship: { pending: ['targetUserId'], accepted: [] },
                save: jest.fn(),
            }) // User
            .mockResolvedValueOnce({
                _id: 'targetUserId',
                friendship: { pending: ['userId'], accepted: [] },
                save: jest.fn(),
            }); // Target
    
        req.body = { userId: 'userId', targetUserId: 'targetUserId' };
    
        // Call the sendFriendRequest function
        await sendFriendRequest(req, res);
    
        // Assertions
        expect(User.findById).toHaveBeenCalledWith('userId');
        expect(User.findById).toHaveBeenCalledWith('targetUserId');
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'Friend successfully added!' });
    });

    test('should send a new friend request and return 200', async () => {
        // Mock User.findById to return user and target without pending requests
        User.findById = jest.fn()
            .mockResolvedValueOnce({
                _id: 'userId',
                friendship: { pending: [], accepted: [] },
                save: jest.fn(),
            }) // User
            .mockResolvedValueOnce({
                _id: 'targetUserId',
                friendship: { pending: [], accepted: [] },
                save: jest.fn(),
            }); // Target

        req.body = { userId: 'userId', targetUserId: 'targetUserId' };

        // Call the sendFriendRequest function
        await sendFriendRequest(req, res);

        // Assertions
        expect(User.findById).toHaveBeenCalledWith('userId');
        expect(User.findById).toHaveBeenCalledWith('targetUserId');
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'Friend request sent!' });
    });

    test('should return 500 if an error occurs', async () => {
        // Mock User.findById to throw an error on the first call
        User.findById = jest.fn().mockRejectedValueOnce(new Error('Database error'));
    
        req.body = { userId: 'userId', targetUserId: 'targetUserId' };
    
        // Call the sendFriendRequest function
        await sendFriendRequest(req, res);
    
        // Assertions
        expect(User.findById).toHaveBeenCalledWith('userId'); // First call
        expect(User.findById).toHaveBeenCalledTimes(1); // Ensure only one call is made
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Something went wrong: sendFriendRequest' });
    });
});