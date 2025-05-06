const { getFriendHabits } = require('./habitController'); //tester created
const Habit = require('../models/habitModel');
jest.mock('../models/habitModel', () => ({
    find: jest.fn(),
}));
// Test for getFriendHabits
describe('getFriendHabits', () => {
    let req, res;

    beforeEach(() => {
        req = { params: { friendId: 'mockFriendId' } }; // Mock request parameters
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        jest.clearAllMocks(); // Clear mocks before each test
    });

    test('should return 200 and a list of public habits for the friend', async () => {
        const mockHabits = [
            {
                _id: '1',
                title: 'Exercise',
                description: 'Workout every morning',
                completions: [],
                currentStreak: 0,
                longestStreak: 0,
                frequency: 'daily',
                user_id: 'mockFriendId',
                isPrivate: false,
                synced: []
            },
            {
                _id: '2',
                title: 'Read',
                description: 'Read a book every night',
                completions: [],
                currentStreak: 0,
                longestStreak: 0,
                frequency: 'daily',
                user_id: 'mockFriendId',
                isPrivate: false,
                synced: []
            }
        ];

        // Mock Habit.find to return the habits
        Habit.find.mockResolvedValue(mockHabits);

        await getFriendHabits(req, res);

        expect(Habit.find).toHaveBeenCalledWith({ user_id: 'mockFriendId', isPrivate: false });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockHabits);
    });

    
    test('should return 200 and an empty array if no public habits are found for the friend', async () => {
        // Mock Habit.find to return an empty array
        Habit.find.mockResolvedValue([]);
    
        await getFriendHabits(req, res);
    
        expect(Habit.find).toHaveBeenCalledWith({ user_id: 'mockFriendId', isPrivate: false });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith([]);
    });
});