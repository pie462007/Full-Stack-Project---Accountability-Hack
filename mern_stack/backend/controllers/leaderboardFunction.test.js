const { getAllHabitsForLeaderboard } = require('./habitController');
const Habit = require('../models/habitModel');
const User = require('../models/userModel');

jest.mock('../models/habitModel', () => ({
    find: jest.fn(() => ({
        lean: jest.fn()
    }))
}));


jest.mock('../models/userModel', () => ({
    find: jest.fn()
}));

describe('getAllHabitsForLeaderboard', () => {
    let req, res;

    beforeEach(() => {
        req = { query: { frequency: 'daily' } }; // Mock request with frequency query
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        jest.clearAllMocks(); // Clear mocks before each test
    });

    test('should return top 10 habits filtered by frequency and sorted by streak', async () => {
        const mockHabits = [
            { _id: '1', title: 'Exercise', frequency: 'daily', currentStreak: 5, user_id: 'user1' },
            { _id: '2', title: 'Read', frequency: 'daily', currentStreak: 10, user_id: 'user2' },
            { _id: '3', title: 'Meditate', frequency: 'weekly', currentStreak: 3, user_id: 'user3' }
        ];
    
        const mockUsers = [
            { _id: 'user1', email: 'user1@example.com' },
            { _id: 'user2', email: 'user2@example.com' },
            { _id: 'user3', email: 'user3@example.com' }
        ];
    
        Habit.find.mockReturnValue({
            lean: jest.fn().mockResolvedValue(mockHabits)
        });
        User.find.mockResolvedValue(mockUsers);
    
        await getAllHabitsForLeaderboard(req, res);
    
        expect(Habit.find).toHaveBeenCalled();
        expect(User.find).toHaveBeenCalledWith({}, 'email _id');
    
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith([
            { _id: '2', title: 'Read', frequency: 'daily', currentStreak: 10, user_id: { email: 'user2@example.com' } },
            { _id: '1', title: 'Exercise', frequency: 'daily', currentStreak: 5, user_id: { email: 'user1@example.com' } }
        ]);
    });


    test('should return 400 if an error occurs', async () => {
        const mockError = new Error('habits.map is not a function');

        Habit.find.mockReturnValue({
            lean: jest.fn().mockResolvedValue(mockError)
        });

        await getAllHabitsForLeaderboard(req, res);

        expect(Habit.find).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: mockError.message });
    });
});